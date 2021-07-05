const express = require('express')
const router = express.Router()
const Post = require('../models/post');
const { isLoggedIn } = require('../middleware')

router.get('/', async (req, res) => {
    const posts = await Post.find({}).sort().sort({ createdAt: 'desc' })
    res.render('posts/index', { posts })
})
router.post('/', isLoggedIn, async (req, res) => {
    const post = new Post(req.body.post)
    await post.save()
    req.flash('success', 'Post created!')
    res.redirect(`/posts/${post._id}`)
})

router.get('/new', isLoggedIn, (req, res) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'You must be logged in to create a post')
        return res.redirect('/login')
    }

    res.render('posts/new')
})

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('comments')
        if (!post) {
            res.render('errors/404')
        } else {
            res.render('posts/show', { post })
        }
    } catch (e) {
        return res.render('errors/404')
    }
})

router.put('/:id', isLoggedIn, async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.render('errors/404')
    } else {
        await Post.findByIdAndUpdate(req.params.id, { ...req.body.post })
        await post.save()
        res.redirect(`/posts/${req.params.id}`)
    }
})

router.delete('/:id', isLoggedIn, async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.render('errors/404')
    } else {
        await Post.findByIdAndDelete(req.params.id)
        res.redirect(`/posts`)
    }
})

router.get('/:id/edit', isLoggedIn, async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.render('errors/404')
    } else {
        res.render('posts/edit', { post })
    }
})

module.exports = router