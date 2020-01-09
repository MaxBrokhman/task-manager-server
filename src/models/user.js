const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
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
  }
})

module.exports = User
