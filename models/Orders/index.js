const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    orderedProducts: [{
        productName: { type:String },
        category: {type: String}
    },]
})

const Orders = mongoose.model('Orders',orderSchema)

module.exports = Orders

