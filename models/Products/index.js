const mongoose = require('mongoose')

const productsSchema = new mongoose.Schema({
    productName: {type: String},
    category: {type: String},
    buyed: {type: Number},
    sold: {type: Number},
    available: {type: Number}
})

const Products = mongoose.model('products', productsSchema)

module.exports = Products