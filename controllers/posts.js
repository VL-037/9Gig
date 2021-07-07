const Post = require('../models/post')

module.exports.index = async (req, res) => {
    const posts = await Post.find({}).sort().sort({ createdAt: 'desc' })
    res.render('posts/index', { posts })
}

module.exports.renderNewForm = (req, res) => {
    res.render('posts/new')
}

module.exports.createPost = async (req, res) => {
    const post = new Post(req.body.post)
    post.author = req.user._id
    await post.save()
    req.flash('success', 'Post created!')
    res.redirect(`/posts/${post._id}`)
}

module.exports.showPost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id).populate({
            path: 'comments',
            populate: {
                path: 'author'
            }
        }).populate('author')
        if (!post) {
            res.render('errors/404')
        } else {
            post = await Post.findById(req.params.id).populate({
                path: 'comments',
                populate: {
                    path: 'author'
                }
            }).populate('author')
            res.render('posts/show', { post })
        }
    } catch (e) {
        return res.render('errors/404')
    }
}

module.exports.renderEditForm = async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.render('errors/404')
    } else {
        res.render('posts/edit', { post })
    }
}

module.exports.updatePost = async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.render('errors/404')
    } else {
        await Post.findByIdAndUpdate(req.params.id, { ...req.body.post })
        await post.save()
        req.flash('success', 'Post updated!')
        res.redirect(`/posts/${req.params.id}`)
    }
}

module.exports.deletePost = async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.render('errors/404')
    } else {
        await Post.findByIdAndDelete(req.params.id)
        req.flash('success', 'Post deleted!')
        res.redirect(`/posts`)
    }
}
