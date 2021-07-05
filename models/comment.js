const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    body: String,
    upvote: Number,
    downvote: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Comment', CommentSchema)