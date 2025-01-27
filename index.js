const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser')
const Users = require('./models/Users')
const Products = require('./models/Products')
const AdminModel = require('./models/Admin')
const Orders = require('./models/Orders')

const app = express()
app.use(cors())
app.use(bodyParser.json())



mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('MongoDB Connected'))
.catch((error) => console.log('MongoDb Connection Failed', error))




// ---------------------------User APIs------------------------------------------------


app.post('/register', async (request, response) => {
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

        if (passwordMatch)
        {
            const jwtToken = jwt.sign({username}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'})
            response.status(200).send({userType: 'USER', jwtToken})
        }
        else{
            response.status(400).send({error: 'Password did not match'})
        }
    }
})

app.get('/', (request, response) => {
    response.send('hello')
})




// -----------------------------Admin APIs---------------------------------------------


app.post('/register-admin', async (request, response) => {
    const {admin_username, admin_password} = request.body

    const adminInDatabase = await AdminModel.findOne({admin_username})

    if (adminInDatabase)
    {
        return response.status(400).send({error:'Admin already exists'})
    }
    
        const adminHashedPassword = await bcrypt.hash(admin_password, 10)

        const newAdmin = new AdminModel({
            admin_username,
            admin_password: adminHashedPassword
        })

        await newAdmin.save()
        return response.status(200).send({message: 'admin created successfully'})
    
})

app.post('/login-admin', async (request, response) => {
    const {admin_username,admin_password} = request.body

    const adminInDatabase = await AdminModel.findOne({admin_username})

    if (adminInDatabase)
    {
        const passwordMatch = await bcrypt.compare(admin_password, adminInDatabase.admin_password)
        if (passwordMatch)
        {
            const jwtToken = jwt.sign({admin_username}, process.env.JWT_SECRET_KEY, {expiresIn: '1h'})

            return response.status(200).send({userType: 'ADMIN',jwtToken})
        }
        else{
            return response.status(400).send({message: 'Invalid password'})
        }
    }
    else{
        return response.status(400).send(({message: 'Username Not exists'}))
    }
})




//------------------------------Products APIs-----------------------------------------------


app.post('/add-new-product', async (request, response) => {
    const {productName, category, buyed} = request.body

    const newProduct = new Products({
        productName,
        category,
        buyed,
        sold: 0,
        available: buyed
    })

    await newProduct.save()

    const allProducts = await Products.find()

    response.status(200).send(allProducts)

})

app.get('/all-products', async (request, response) => {
    const allProducts = await Products.find()

    response.status(200).send(allProducts)
})




//------------------------------------Order APIs--------------------------------------------
app.post('/place-order', async (request, response) => {
    const {orderItems} = request.body

    const newOrder = await new Orders({orderedProducts: orderItems.map(eachOrder => ({productName: eachOrder.productName, category: eachOrder.category
    })) })

    await newOrder.save()

    response.status.send({message: 'Order placed successfully'})
})

app.get('/orders', async (request, response) => {
    const ordersList = await Orders.find()

    response.status(200).send(ordersList)
})



//------------------------------------Users APIs--------------------------------------------

app.get('/all-users', async (request, response) => {
    const allUsers = await Users.find()

    response.status(200).send(allUsers)
})
// --------------------------------------END-------------------------------------------

const PORT = process.env.PORT
app.listen(PORT, () => {console.log(`Server Running at ${PORT}`)})