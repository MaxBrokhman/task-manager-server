const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const User = require('../src/models/user')

const user2Id = new mongoose.Types.ObjectId()

const setupDb = async () => {
  await User.deleteMany()
  await new User(user2).save()
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

module.exports = {
  user1,
  user2,
  setupDb,
}
