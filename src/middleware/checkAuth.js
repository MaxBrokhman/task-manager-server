const jwt = require('jsonwebtoken')

const User = require('../models/user')

const checkAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decode = jwt.verify(token, 'mvkjgcjc')
    const user = await User.findOne({ _id: decode._id, 'tokens.token': token })
    if(!user) throw new Error()
    req.token = token
    req.user = user
    next()
  } catch {
    res.status(401).send({ error: 'Please authentificate' })
  }
}

module.exports = checkAuth
