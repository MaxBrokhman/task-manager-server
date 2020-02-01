const request = require('supertest')

const app = require('../src/app')
const User = require('../src/models/user')
const {
  user1, 
  user2,
  user4,
  setupDb,
} = require('./fixtures')

beforeEach(setupDb)

test('Should sign up a new user', async () => {
  const response = await request(app)
    .post('/users/signup')
    .send(user1)
    .expect(201)

  // assertion that database was changed correctly
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

    
  // assertions about response
  expect(response.body).toMatchObject({
    user: {
      name: user1.name,
      email: user1.email,
    },
    token: user.tokens[0].token,
  })
  expect(user.password).not.toBe(user1.password)
})

test('Should not sign up a user with invalid email', async () => {
  const response = await request(app)
    .post('/users/signup')
    .send(user4)
    .expect(400)
})

test('Should log in existing user', async () => {
  const response = await request(app)
    .post('/users/login')
    .send({
      email: user2.email,
      password: user2.password,
    })
    .expect(200)

  //assertion about token
  const user = await User.findById(response.body.user._id)
  expect(response.body.token).toBe(user.tokens[1].token)
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

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should update valid user fields', async () => {
  const updated = {
    name: 'Johny',
  }
  const response = await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .send(updated)
    .expect(200)
  
  // assertion that user updated correctly
  const user = await User.findById(response.body._id)
  expect(user.name).toEqual(updated.name)
})

test('Should not updated invalid user fields', async () => {
  const updated = {
    location: 'Russia'
  }
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .send(updated)
    .expect(400)
})

test('Should delete account for authanticated user', async () => {
  const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${user2.tokens[0].token}`)
    .send()
    .expect(200)

  //assertion that user not in database anymore
  const user = await User.findById(response.body._id)
  expect(user).toBeNull()
})

test('Should not delete account for authanticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})
