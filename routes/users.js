const express = require('express')
const router = express.Router()
const passport = require('passport')
const { isLoggedIn } = require('../middleware')
const User = require("../models/user")

router.get('/register', (req, res) => {
    if(req.user){
        req.flash('error', 'You have to logout first to register')
        return res.redirect('/posts')
    }
    res.render('users/register')
})

router.post('/register', async (req, res, next) => {
    const { email, username, password } = req.body
    const isExists = await User.find({ email: email, username: username })
    if (isExists.length > 0) {
        console.log(await User.find({ email: email, username: username }))
        req.flash('error', 'Username / email already exists')
        return res.redirect('/register')
    }
    const newUser = new User({ email, username })
    const user = await User.register(newUser, password);
    req.login(user, err => {
        if(err) return next(err)
        req.flash('success', 'Welcome to 9Gig. Remember. ~FOR FUN ONLY~')
        res.redirect('/posts')
    })
})

router.get('/login', (req, res) => {
    if(req.user){
        req.flash('success', 'You are already logged in')
        return res.redirect('/posts')
    }
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async (req, res) => {
    req.flash('success', 'Welcome back to 9Gig, have fun')
    const redirectUrl = req.session.requestedUrl || '/posts'
    delete req.session.requestedUrl
    res.redirect(redirectUrl)
})

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout()
    req.flash('success', "Successfully logged out, don't forget to comeback :D")
    res.redirect('/posts')
})


module.exports = router