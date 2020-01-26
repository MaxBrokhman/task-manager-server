const request = require('supertest')

const app = require('../src/app')
const Task = require('../src/models/task')
const {
  user2,
  setupDb,
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
