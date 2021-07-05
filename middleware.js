module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'You have to login first')
        return res.redirect('/login')
    }
    next()
}