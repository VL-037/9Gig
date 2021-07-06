const express = require('express')
const router = express.Router()
const passport = require('passport')
const { isLoggedIn } = require('../middleware')
const User = require("../models/user")

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', async (req, res) => {
    const { email, username, password } = req.body
    const isExists = await User.find({ email: email, username: username })
    if (isExists) {
        req.flash('error', 'Username / email already exists')
        return res.redirect('/register')
    }
    const newUser = new User({ email, username })
    const user = await User.register(newUser, password);
    req.flash('success', 'Welcome to 9Gig. Remember. ~FOR FUN ONLY~')
    res.redirect('/posts')
})

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), async (req, res) => {
    res.redirect('/posts')
})

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout()
    req.flash('success', "Successfully logged out, don't forget to comeback :D")
    res.redirect('/posts')
})


module.exports = router