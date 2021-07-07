const express = require('express')
const router = express.Router({ mergeParams: true })
const comments = require('../controllers/comments');
const { isLoggedIn } = require('../middleware')

router.post('/', isLoggedIn, comments.createComment)

router.delete('/:commentId', isLoggedIn, comments.deleteComment)

module.exports = router