module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.requestedUrl = req.originalUrl
        req.flash('error', 'You have to login first')
        return res.redirect('/login')
    }
    next()
}