const Post = require('../models/post')
const Tag = require('../models/tag')
const { cloudinary } = require('../cloudinary')

let seenIds = []
module.exports.index = async (req, res) => {
    seenIds = []
    const posts = await Post.find({ "_id": { "$nin": seenIds } }).sort().sort({ createdAt: 'desc' }).populate('tags').limit(3)
    posts.forEach(p => {
        seenIds.push(p._id)
    })
    const tags = await Tag.find({}).sort({ body: 'asc' })
    const currUser = req.user
    res.render('posts/index', { posts, tags, currUser })
}

module.exports.getMorePosts = async (req, res) => {
    const posts = await Post.find({ "_id": { "$nin": seenIds } }).sort().sort({ createdAt: 'desc' }).populate('tags').limit(3)
    posts.forEach(p => {
        seenIds.push(p._id)
    })
    const currUser = req.user
    res.send({ posts, currUser })
}

module.exports.renderNewForm = async (req, res) => {
    const tags = await Tag.find({}).sort({ body: 'asc' })
    res.render('posts/new', { tags })
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
    const tags = await Tag.find({}).sort({ body: 'asc' })
    try {
        let post = await Post.findById(req.params.id || post._id)
        if (!post) {
            res.render('errors/404')
        } else {
            const currUser = req.user
            post = await Post.findById(req.params.id || post._id).populate('tags').populate('author').populate({
                path: 'comments',
                populate: {
                    path: 'author'
                }
            })
            res.render('posts/show', { post, tags, currUser })
        }
    } catch (e) {
        return res.render('errors/404')
    }
}

module.exports.randomPost = async (req, res) => {
    const postsCount = await Post.estimatedDocumentCount()
    const random = Math.floor(Math.random() * postsCount)
    const post = await Post.findOne().skip(random)
    res.redirect(`${post._id}`)
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