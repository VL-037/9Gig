const express = require('express')
const router = express.Router()
const passport = require('passport')
const { isLoggedIn } = require('../middleware')
const users = require("../controllers/users")

router.route('/register')
    .get(users.renderRegister)
    .post(users.register)

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

router.get('/logout', isLoggedIn, users.logout)

module.exports = router