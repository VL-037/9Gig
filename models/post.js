const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Comment = require('./comment')

const ImageSchema = new Schema({
    url: String,
    filename: String
})

const PostSchema = new Schema({
    title: String,
    images: [ImageSchema],
    upvote: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    upvoteNum: Number,
    downvote: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    downvoteNum: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    tags: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Tag'
        }
    ]
})

//middleware for delete all comments when deleting a post
PostSchema.post('findOneAndDelete', async (post) => {
    if (post) {
        await Comment.deleteMany({
            _id: {
                $in: post.comments
            }
        })
    }
})

module.exports = mongoose.model('Post', PostSchema)