const mongoose = require('mongoose')

// mongodb/bin/mongod.exe --dbpath=mongodb-data
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})
