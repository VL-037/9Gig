const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TagSchema = new Schema({
    body: String,
    url: String,
    usedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    countNum: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Tag', TagSchema)