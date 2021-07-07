const express = require('express')
const router = express.Router()
const posts = require('../controllers/posts');
const { isLoggedIn } = require('../middleware');

router.route('/')
    .get(posts.index)
    .post(isLoggedIn, posts.createPost)

router.get('/new', isLoggedIn, posts.renderNewForm)

router.get('/:id/edit', isLoggedIn, posts.renderEditForm)

router.route('/:id')
    .get(posts.showPost)
    .put(isLoggedIn, posts.updatePost)
    .delete(isLoggedIn, posts.deletePost)

module.exports = router