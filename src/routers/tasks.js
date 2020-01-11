const express = require('express')

const Task = require('../models/task')
const checkAuth = require('../middleware/checkAuth')

const router = new express.Router()

module.exports = router

router.post('/tasks', checkAuth, async ({ body, user }, res) => {
  const task = new Task({
    ...body,
    userId: user._id,
  })
  try {
    await task.save()
    res.status(201).send(task)
  } catch(error) {
    res.status(400).send(error)
  }
})

router.get('/tasks', checkAuth, async ({ user, query }, res) => {
  const match = {}
  if(query.completed) {
    options.completed = query.completed === 'true' 
      ? true
      : false 
  }
  try {
    await user.populate({
      path: 'tasks',
      match,
      options: {
        limit: parseInt(query.limit),
        skip: parseInt(query.skip),
      },
    }).execPopulate()
    res.send(user.tasks)
  } catch {
    res.status(500).send()
  }
})

router.get('/tasks/:id', checkAuth, async ({ params, user }, res) => {
  try {
    const task = await Task.findOne({
      _id: params.id,
      userId: user._id,
    })
    task 
      ? res.send(task) 
      : res.status(404).send()
  } catch {
    res.status(500).send()
  }
})

router.patch('/tasks/:id', checkAuth, async ({ params, body, user }, res) => {
  const updates = Object.keys(body)
  const allowedUpdates = ['description', 'completed']
  const isAllowed = updates.every(update => allowedUpdates.includes(update))
  if(!isAllowed) return res.status(400).send({ 'error': 'Invalid updates!' })
  try {
    const task = await Task.findOne({
      _id: params.id,
      userId: user._id,
    })
    if(!task) return res.status(404).send()
    updates.forEach(key => task[key] = body[key])
    await task.save()
    res.send(task)
  } catch(error) {
    res.status(400).send(error)
  }
})

router.delete('/tasks/:id', checkAuth, async ({ params, user }, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: params.id,
      userId: user._id,
    })
    task 
      ? res.send(task) 
      : res.status(404).send()
  } catch {
    res.status(500).send()
  }
})
