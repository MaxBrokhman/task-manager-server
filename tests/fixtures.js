const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const User = require('../src/models/user')
const Task = require('../src/models/task')

const user2Id = new mongoose.Types.ObjectId()
const user3Id = new mongoose.Types.ObjectId()

const task1Id = new mongoose.Types.ObjectId()

const task1 = {
  _id: task1Id,
  description: 'First task',
  userId: user2Id,
}

const task2 = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second task',
  userId: user2Id,
  completed: true,
}

const task3 = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third task',
  userId: user3Id,
  completed: true,
}

const user1 = {
  name: 'Andy',
  email: 'andymad@example.com',
  password: 'ghg86r8yf88',
}

const user2 = {
  _id: user2Id,
  name: 'Mike',
  email: 'mike1@example.com',
  password: 'sjdbjvibsd9v',
  tokens: [{
    token: jwt.sign({ _id: user2Id }, process.env.JWT_SECRET),
  }],
}

const user3 = {
  _id: user3Id,
  name: 'Anna',
  email: 'anna@example.com',
  password: 'ldnlsndbnsd9bdf',
  tokens: [{
    token: jwt.sign({ _id: user3Id }, process.env.JWT_SECRET),
  }],
}

const user4 = {
  name: 'Jamie',
  email: 'sdvsdv@',
  password: 'ghg86sdvbksdbvs9r8yf88',
}

const setupDb = async () => {
  await User.deleteMany()
  await Task.deleteMany()
  await new User(user2).save()
  await new User(user3).save()
  await new Task(task1).save()
  await new Task(task2).save()
  await new Task(task3).save()
}

module.exports = {
  user1,
  user2,
  user3,
  user4,
  setupDb,
  task1Id,
  task1,
  task2,
}
