const mongoose = require('mongoose')

// mongodb/bin/mongod.exe --dbpath=mongodb-data
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
