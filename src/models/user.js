const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: 'Stranger',
  },
  email: {
    type: String,
    required: true,
    validate(value){
      if(!validator.isEmail(value)) throw new Error('Email not valid')
    },
    trim: true,
    lowercase: true,
    unique: true,
  },
  age: {
    type: Number,
    validate(value) {
      if(value < 0) throw new Error('Age must be positive number')
    }
  },
  password: {
    type: String,
    trim: true,
    validate(value){
      const isLengthValid = value.length > 6
      const isPassword = value.indexOf('password') > -1
      if(!isLengthValid || isPassword) throw new Error('Password not valid')
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }],
}, {
  timestamps: true,
})

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'userId',
})

userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign({ _id: this._id.toString() }, 'mvkjgcjc')
  this.tokens = [...this.tokens, { token }]
  await this.save()
  return token
}

userSchema.methods.toJSON = function() {
  const user = this.toObject()
  delete user.password
  delete user.tokens
  return user
}

userSchema.statics.findByCredentials = async ({ password, email }) => {
  const user = await User.findOne({ email })
  if(!user) throw new Error('Unable to find user')
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch) throw new Error('Unable to login. Password is not correct.')
  return user
}

// hash password before saving
userSchema.pre('save', async function(next) {
  if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})

// delete user tasks on user deleting
userSchema.pre('remove', async function(next) {
  await Task.deleteMany({
    userId: this._id,
  })
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User
