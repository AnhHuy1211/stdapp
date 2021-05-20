const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AccountSchema = new Schema({
    local: {
        password: String,
        phone_number: {
            type: String,
            maxlength: 11
        },
        birthday: String,
    },
    google: {
        id: String,
        token: String,
        class: String
    },
    first_name: String,
    last_name:String,
    email: {
        type: String,
        unique: true,
    },
    departments: String,
    role: String
});
module.exports = mongoose.model('Account', AccountSchema)
