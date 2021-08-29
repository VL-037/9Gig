const Tag = require('../models/tag')

module.exports.index = async (req, res) => {
    if(!req.user){
        return res.render('errors/404')
    }

    if (req.user.role !== ('admin')) {
        return res.render('errors/404')
    } else {
        const tags = await Tag.find({}).sort({ body: 'asc' })
        const currUser = req.user
        return res.render('tags/index', { tags, currUser })
    }

}