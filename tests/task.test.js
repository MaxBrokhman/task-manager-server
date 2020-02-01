const request = require('supertest')

const app = require('../src/app')
const Task = require('../src/models/task')
const {
  user2,
  user3,
  setupDb,
  task1Id,
  task1,
  task2,
} = require('./fixtures')

beforeEach(setupDb)

test('Should create task', async () => {
  const testTask = 'test tests'

  const response = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .send({
      description: testTask
    })
    .expect(201)

  const task = await Task.findById(response.body._id)
  expect(task).not.toBeNull()
  expect(task.description).toEqual(testTask)
  expect(task.completed).toBe(false)
})

test('Should not create task with invalid description', async () => {
  await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .send({
      completed: true,
    })
    .expect(400)
})

test('Should not update task with invalid description', async () => {
  await request(app)
    .patch(`/tasks/${task1Id}`)
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .send({
      completed: true,
      description: '',
    })
    .expect(400)
})

test('Should not allow user update task of another user', async () => {
  await request(app)
    .patch(`/tasks/${task1Id}`)
    .set('Authorization', `Bearer ${user3.tokens[0].token}`)
    .send({
      description: 'not to do',
      completed: true,
    })
    .expect(404)
})

test('Should get all tasks for a given user', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .expect(200)

  expect(response.body.length).toEqual(2)
})

test('Should get task by id', async () => {
  const response = await request(app)
    .get(`/tasks/${task1Id}`)
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .expect(200)

  expect(response.body.description).toEqual(task1.description)
})

test('Should not get task by id if user unauthenticated', async () => {
  await request(app)
    .get(`/tasks/${task1Id}`)
    .expect(401)
})

test('Should not get another users task by id', async () => {
  await request(app)
    .get(`/tasks/${task1Id}`)
    .set('Authorization', `Bearer ${user3.tokens[0].token}`)
    .expect(404)
})

test('Should get only completed tasks', async () => {
  const response = await request(app)
    .get(`/tasks?completed=true`)
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .expect(200)
  
    expect(response.body.length).toEqual(1)
    expect(response.body[0].completed).toBe(true)
})

test('Should get only incomplete tasks', async () => {
  const response = await request(app)
    .get(`/tasks?completed=false`)
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .expect(200)
  
    expect(response.body.length).toEqual(1)
    expect(response.body[0].completed).toBe(false)
})

test('Should get tasks sorted by date', async () => {
  const response = await request(app)
    .get(`/tasks?sortBy=createdAt:asc`)
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .expect(200)
  
    expect(response.body.length).toEqual(2)
    expect(response.body[0].description).toEqual(task1.description)
    expect(response.body[1].description).toEqual(task2.description)
})

test('Should get tasks sorted by date in descending order', async () => {
  const response = await request(app)
    .get(`/tasks?sortBy=createdAt:desc`)
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .expect(200)
  
    expect(response.body.length).toEqual(2)
    expect(response.body[0].description).toEqual(task2.description)
    expect(response.body[1].description).toEqual(task1.description)
})

test('Should get tasks sorted by description', async () => {
  const response = await request(app)
    .get(`/tasks?sortBy=description:asc`)
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .expect(200)
  
    expect(response.body.length).toEqual(2)
    expect(response.body[0].description).toEqual(task1.description)
    expect(response.body[1].description).toEqual(task2.description)
})

test('Should get tasks sorted by description in descending order', async () => {
  const response = await request(app)
    .get(`/tasks?sortBy=description:desc`)
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .expect(200)
  
    expect(response.body.length).toEqual(2)
    expect(response.body[0].description).toEqual(task2.description)
    expect(response.body[1].description).toEqual(task1.description)
})

test('Should not allow user delete task of another user', async () => {
  await request(app)
    .delete(`/tasks/${task1Id}`)
    .set('Authorization', `Bearer ${user3.tokens[0].token}`)
    .expect(404)
    
  // assertion that task is still in data base
  const task = await Task.findById(task1Id)
  expect(task.description).toEqual(task1.description)
})

test('Should not delete task if user unauthenticated', async () => {
  await request(app)
    .delete(`/tasks/${task1Id}`)
    .expect(401)
})

test('Should delete users task', async () => {
  const response = await request(app)
    .delete(`/tasks/${task1Id}`)
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .expect(200)
    
  // assertion that task is still in data base
  const taskInDb = await Task.findById(task1Id)
  expect(taskInDb).toBeNull()
  expect(response.body.description).toEqual(task1.description)
})
