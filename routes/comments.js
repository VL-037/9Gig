const express = require('express')
const router = express.Router()
const Post = require('../models/post');
const Comment = require('../models/comment');
const { isLoggedIn } = require('../middleware')

router.post('/', isLoggedIn, async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.render('errors/404')
    } else {
        const comment = new Comment(req.body.comment)
        post.comments.push(comment)
        await comment.save()
        await post.save()
        res.redirect(`/posts/${post._id}`)
    }
})

router.delete('/:commentId', isLoggedIn, async (req, res) => {
    const { id, commentId } = req.params
    const post = await Post.findById(id)
    if (!post) {
        res.render('errors/404')
    } else {
        await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } })
        await Comment.findByIdAndDelete(commentId)
        res.redirect(`/posts/${post._id}`)
    }
})

module.exports = router