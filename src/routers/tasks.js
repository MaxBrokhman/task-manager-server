const express = require('express')
const Task = require('../models/task')

const router = new express.Router()

module.exports = router

router.post('/tasks', async (req, res) => {
  const task = new Task(req.body)
  try {
    await task.save()
    res.status(201).send(task)
  } catch(error) {
    res.status(400).send(error)
  }
})

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({})
    res.send(tasks)
  } catch {
    res.status(500).send()
  }
})

router.get('/tasks/:id', async ({ params }, res) => {
  try {
    const task = await Task.findById(params.id)
    task 
      ? res.send(task) 
      : res.status(404).send()
  } catch {
    res.status(500).send()
  }
})

router.patch('/tasks/:id', async ({ params, body }, res) => {
  try {
    const task = await Task.findById(params.id)
    if(!task) return res.status(404).send()
    Object.keys(req.body).forEach(key => task[key] = req.body[key])
    await task.save()
    res.send(task)
  } catch(error) {
    res.status(400).send(error)
  }
})

router.delete('/tasks/:id', async ({ params }, res) => {
  try {
    const task = await Task.findByIdAndDelete(params.id)
    task 
      ? res.send(task) 
      : res.status(404).send()
  } catch {
    res.status(500).send()
  }
})
