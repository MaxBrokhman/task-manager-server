const request = require('supertest')

const app = require('../src/app')
const Task = require('../src/models/task')
const {
  user2,
  user3,
  setupDb,
  task1Id,
  task1,
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

test('Should get all tasks for a given user', async () => {
  const response = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .expect(200)

  expect(response.body.length).toEqual(2)
})

test('Should not allow user delete task of other user', async () => {
  await request(app)
    .get(`/tasks:${task1Id}`)
    .set('Authorization', `Bearer ${user3.tokens[0].token}`)
    .expect(404)
    
  // assertion that task is still in data base
  const task = await Task.findById(task1Id)
  expect(task.description).toEqual(task1.description)
})
