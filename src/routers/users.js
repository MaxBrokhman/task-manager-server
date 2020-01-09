const express = require('express')
const User = require('../models/user')

const router = new express.Router()

module.exports = router

router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    res.status(201).send(user)
  } catch(error) {
    res.status(400).send(error)
  }
})

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch {
    res.status(500).send()
  }
})

router.get('/users/:id', async ({ params }, res) => {
  try {
    const user = await User.findById(params.id)
    user 
      ? res.send(user) 
      : res.status(404).send()
  } catch {
    res.status(500).send()
  }
})

router.patch('/users/:id', async ({ params, body }, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      params.id, 
      body, 
      {
        new: true, 
        runValidators: true, 
        useFindAndModify: false,
      },
    )
    user 
      ? res.send(user) 
      : res.status(404).send()
  } catch(error) {
    res.status(400).send(error)
  }
})

router.delete('/users/:id', async ({ params }, res) => {
  try {
    const user = await User.findByIdAndDelete(params.id)
    user 
      ? res.send(user) 
      : res.status(404).send()
  } catch {
    res.status(500).send()
  }
})
