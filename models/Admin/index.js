const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    admin_username: {type: String, required: true, unique: true},
    admin_password: {type: String, required: true}
})

const AdminModel = mongoose.model('aminUsers', adminSchema)

module.exports = AdminModel