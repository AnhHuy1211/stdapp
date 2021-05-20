require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const cookieSession= require('cookie-session');
const session = require('express-session');
const jwt = require('jsonwebtoken');
require('./config/passport')(passport);

const registerValidator = require('./validators/RegisterValidator')

const app = express()
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cookieSession({
    name: 'stdproject-session',
    keys: ['key1', 'key2'],
    maxAge: 24 * 60 * 60 * 1000
}))
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'somesecret',
    cookie: { maxAge: 60000 }}));

app.use(passport.initialize())
app.use(passport.session())
app.use(flash());
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

const AccountRouter = require('./routers/AccountRouter')

const isLoggedIn = (req, res, next) => {
    if(req.user || req.session.User) {
        next();
    }
    else {
        return res.redirect('./account/login')
    }
}
app.get('/',isLoggedIn, (req, res)=> {
    return res.json({
        code: 0,
        message: 'This is homepage'
    })
})

app.get('/failed', (req, res) =>{
    return res.send('Fail to login')
})

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/failed' }),
    function(req, res) {
        let user = req.user
        console.log(user)
        req.session.User = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            class: user.google.class,
            departments: user.departments,
            phone: user.local.phone_number,
            dateob: user.local.birthday,
            role: user.role
        }
        res.redirect('/account/info');
    });

app.get('/logout', (req, res) => {
    req.session = null
    req.logout();
    res.redirect('/')
})

app.use('/account',AccountRouter)

const port = process.env.PORT || 8080
mongoose.connect('mongodb://localhost/stdproject', {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(()=> {
    app.listen(port, ()=> {
        console.log(`http://localhost:${port}/`)
    })
})
    .catch(e => console.log("Can't connect to stdproject: " + e.message))
