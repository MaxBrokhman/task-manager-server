const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const user1 = {
  name: 'Andy',
  email: 'andymad@example.com',
  password: 'ghg86r8yf88',
}

const user2 = {
  name: 'Mike',
  email: 'mike1@example.com',
  password: 'sjdbjvibsd9v',
}

beforeEach(async () => {
  await User.deleteMany()
  await new User(user2).save()
})

test('Should sign up a new user', async () => {
  await request(app)
    .post('/users')
    .send(user1)
    .expect(201)
})

test('Should log in existing user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: user2.email,
      password: user2.password,
    })
    .expect(200)
})

test('Should not log in unexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: 'mailmail@mail.com',
      password: 'nonexistentpassword',
    })
    .expect(400)
})
