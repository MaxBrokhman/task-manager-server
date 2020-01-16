const express = require('express')

const User = require('../models/user')
const checkAuth = require('../middleware/checkAuth')
const { 
  sendEmail, 
  getWelcomeText, 
  getByeText,
} = require('../utils')
const { signUpEmailSubject, deleteSubject } = require('../config')

const router = new express.Router()

module.exports = router

router.post('/users', async ({ body }, res) => {
  const user = new User(body)
  try {
    await user.save()
    res.status(201).send(user)
  } catch(error) {
    res.status(400).send(error)
  }
})

router.get('/users/me', checkAuth, async ({ user }, res) => res.send(user))

router.patch('/users/me', checkAuth, async ({ user, body }, res) => {
  const updates = Object.keys(body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isAllowed = updates.every(update => allowedUpdates.includes(update))
  if(!isAllowed) return res.status(400).send({ 'error': 'Invalid updates!' })
  try {
    updates.forEach(key => user[key] = body[key])
    await user.save()
    res.send(user)
  } catch(error) {
    res.status(400).send(error)
  }
})

router.delete('/users/me', checkAuth, async ({ user }, res) => {
  try {
    await user.remove()
    sendEmail({
      email: user.email,
      subject: deleteSubject,
      text: getByeText(user.name),
    })
    res.send(user) 
  } catch {
    res.status(500).send()
  }
})

router.post('/users/login', async ({ body }, res) => {
  try {
    const user = await User.findByCredentials(body)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post('/users/signup', async ({ body }, res) => {
  try {
    const user = new User(body)
    sendEmail({
        email: user.email,
        subject: signUpEmailSubject,
        text: getWelcomeText(user.name),
    })
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post('/users/logout', checkAuth, async ({ user, token }, res) => {
  try {
    user.tokens = user.tokens.filter(item => item.token !== token)
    await user.save()
    res.send()
  } catch {
    res.status(500).send()
  }
})

router.post('/users/logoutAll', checkAuth, async ({ user }, res) => {
  try {
    user.tokens = []
    await user.save()
    res.send()
  } catch {
    res.status(500).send()
  }
})
