const Tag = require('../models/tag')
const mongoose = require('mongoose');

module.exports.index = async (req, res) => {
    if(!req.user){
        return res.render('errors/404')
    }

    if (req.user.role !== ('admin')) {
        return res.render('errors/404')
    } else {
        const tags = await Tag.find({}).sort({ body: 'asc' })
        const tag_id = mongoose.Types.ObjectId();
        const currUser = req.user
        return res.render('tags/index', { tags, tag_id, currUser })
    }
}

module.exports.createTag = async (req, res) => {
    var tag = new Tag(req.body.tag)
    tag.url = req.body.tag.body.toLowerCase().replace(/\s/g, "-")
    await tag.save()
    req.flash('success', 'New Tag created!')
    res.redirect('/tags')
}