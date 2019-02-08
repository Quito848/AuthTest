const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('.\\models\\User');
const pool = require('.\\config\\postgres');
const bcrypt = require('bcrypt');
const passportLocalPostgres = require('passport-local-postgres')(pool);
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(require('express-session')({
    secret: "I do not know It is secret I guess",
    resave: false,
    saveUninitialized: false
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(passportLocalPostgres.localStrategy));
passport.serializeUser(passportLocalPostgres.serializeUser);
passport.deserializeUser(passportLocalPostgres.deserializeUser);

//==============
//ROUTES
//==============
app.get('/',(req,res) =>{
    res.render('index.ejs');
    console.log(req.user);
});

app.get('/register',(req,res) =>{
    res.render('register.ejs')
});

app.post('/register',(req,res) =>{
    const name = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password, 10, function(err, hash) {
        pool.query('INSERT INTO users (username,password) VALUES($1,$2)', [name,hash], (err, res) => {
            if (err) {
                console.log(err);
            }
            console.log('done')
        })
    });
});

const isLoggedIn = (req,res,next) =>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/sign');
};

app.get('/sign',(req,res) =>{
   res.render('sign');
});

app.post('/sign',passport.authenticate('local',{
    successRedirect: '/secret',
    failureRedirect: '/sign'
}),(req,res)=>{

});

app.get('/logout',(req,res) =>{
   req.logout();
   res.redirect('/')
});

app.get('/secret',isLoggedIn,(req,res) =>{
    res.send('SECRET');
});




module.exports = app;
