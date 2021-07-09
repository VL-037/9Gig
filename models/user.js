const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    googleId: String,
    image: String,
    email: String,
    username: String
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)