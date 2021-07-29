const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

router.get(
    '/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        const redirectUrl = req.session.requestedUrl || '/posts'
        delete req.session.requestedUrl
        res.redirect(redirectUrl)
        res.redirect('/posts')
    })

module.exports = router