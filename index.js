const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB Connected'))
.catch((error) => console.log('MongoDb Connection Failed', error))
