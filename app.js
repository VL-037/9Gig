const express = require('express')
const app = express();
const path = require('path')
const ejsMate = require('ejs-mate')
const dotenv = require("dotenv").config()
const methodOverride = require('method-override');
const moment = require('moment')
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require('mongoose');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/9gig'

const User = require('./models/user')

const postRoutes = require('./routes/posts')
const commentRoutes = require('./routes/comments')
const userRoutes = require('./routes/users')

app.use((req, res, next) => {
    res.locals.moment = moment;
    next();
});

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"))
db.once('open', () => {
    console.log("MongoDB connected");
});

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'static')))

const SECRET = process.env.SECRET || 'thiscantbeagoodsecrettoaccess9Gig'
const sessionConfig = {
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week cookie
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/', userRoutes)
app.use('/posts', postRoutes)
app.use('/posts/:id/comments', commentRoutes)

app.get('/', (req, res) => {
    res.render('home')
})

app.get("*", (req, res) => {
    res.render('errors/404')
})

const port = process.env.PORT
app.listen(port, () => {
    console.log('Listening on port', port)
})