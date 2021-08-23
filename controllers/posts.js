const Post = require('../models/post')
const { cloudinary } = require('../cloudinary')

module.exports.index = async (req, res) => {
    const posts = await Post.find({}).sort().sort({ createdAt: 'desc' })
    const currUser = req.user
    res.render('posts/index', { posts, currUser })
}

module.exports.renderNewForm = (req, res) => {
    res.render('posts/new')
}

module.exports.createPost = async (req, res) => {
    const post = new Post(req.body.post)
    post.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    post.author = req.user._id
    post.upvote = []
    post.upvoteNum = 0
    post.downvote = []
    post.downvoteNum = 0
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
            const currUser = req.user
            post = await Post.findById(req.params.id).populate({
                path: 'comments',
                populate: {
                    path: 'author'
                }
            }).populate('author')
            res.render('posts/show', { post, currUser })
        }
    } catch (e) {
        return res.render('errors/404')
    }
}

module.exports.randomPost = async (req, res) => {
    const postsCount = await Post.estimatedDocumentCount()
    const random = Math.floor(Math.random() * postsCount)
    const currUser = req.user
    const post = await Post.findOne().skip(random).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author')

    res.render('posts/show', { post, currUser })
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
        for (let image of post.images) {
            await cloudinary.uploader.destroy(image.filename)
        }
        await Post.findByIdAndDelete(req.params.id)
        req.flash('success', 'Post deleted!')
        res.redirect(`/posts`)
    }
}

module.exports.upvotePost = async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.render('errors/404')
    } else {
        const upvoted = await Post.find({ _id: req.params.id, upvote: { $in: [req.user._id] } });
        const downvoted = await Post.find({ _id: req.params.id, downvote: { $in: [req.user._id] } });
        if (downvoted.length > 0 && upvoted.length <= 0) {
            post.downvoteNum -= 1
            await post.updateOne({ $pull: { downvote: { $in: [req.user._id] } } })
            post.upvoteNum += 1
            post.upvote.push(req.user._id)
        }
        else if (upvoted.length > 0) {
            post.upvoteNum -= 1
            await post.updateOne({ $pull: { upvote: { $in: [req.user._id] } } })
        } else {
            post.upvoteNum += 1
            post.upvote.push(req.user._id)
        }
        post.save();
    }
}

module.exports.downvotePost = async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.render('errors/404')
    } else {
        const upvoted = await Post.find({ _id: req.params.id, upvote: { $in: [req.user._id] } });
        const downvoted = await Post.find({ _id: req.params.id, downvote: { $in: [req.user._id] } });
        if (upvoted.length > 0 && downvoted.length <= 0) {
            post.upvoteNum -= 1
            await post.updateOne({ $pull: { upvote: { $in: [req.user._id] } } })
            post.downvoteNum += 1
            post.downvote.push(req.user._id)
        }
        else if (downvoted.length > 0) {
            post.downvoteNum -= 1
            await post.updateOne({ $pull: { downvote: { $in: [req.user._id] } } })
        } else {
            post.downvoteNum += 1
            post.downvote.push(req.user._id)
        }
        post.save();
    }
}