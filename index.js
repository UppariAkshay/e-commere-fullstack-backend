const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json())



mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB Connected'))
.catch((error) => console.log('MongoDb Connection Failed', error))

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
})

const Users = mongoose.model('users', userSchema)

app.post('/register', async (request, response) => {
    console.log(request.body)
    const {username, password} = request.body

    const existinguser = await Users.findOne({username})
    if (existinguser)
    {
        return response.send({error: "User already exists."})
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new Users({
        username: username,
        password: hashedPassword
    })

    await newUser.save()

    response.send({message: 'User added successfully'})
})

app.post('/login', async (request, response) => {
    const {username, password} = request.body

    const userInDatabase = await Users.findOne({username})

    if (!userInDatabase)
    {
        response.status(400).send({error: 'User not found'})
    }
    else{
        const passwordMatch = await bcrypt.compare(password, userInDatabase.password)
        console.log(passwordMatch)
        if (passwordMatch)
        {
            const jwtToken = jwt.sign({username, password}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'})
            response.status(200).send({error: 'Login Successful', jwtToken})
        }
        else{
            response.status(400).send({error: 'Password did not match'})
        }
    }
})

app.get('/', (request, response) => {
    response.send('hello')
})


const PORT = process.env.PORT
app.listen(PORT, () => {console.log(`Server Running at ${PORT}`)})