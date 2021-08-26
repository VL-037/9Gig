const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TagSchema = new Schema({
    body: String,
    url: String
})

module.exports = mongoose.model('Tag', TagSchema)