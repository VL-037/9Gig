const express = require('express')
const router = express.Router()
const tags = require('../controllers/tags');

router.route('/')
    .get(tags.index)
    .post(tags.createTag)

module.exports = router