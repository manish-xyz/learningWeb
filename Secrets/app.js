require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// -- Creating new Session --------------------------------

app.use(session({
    secret: 'Hello bro',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// -- conncet database --------------------------------

mongoose.connect('mongodb://localhost:27017/usersDB');

// --  Creating user --------------------------------

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
});

userSchema.plugin(passportLocal);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);

// -- --------------------------------

passport.use(User.createStrategy());

passport.serializeUser( (user, done) => {

    done(null, user._id);
});

passport.deserializeUser( (id, done) => {

  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// -- Google open auth --------------------------------

passport.use(new GoogleStrategy({

    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/testing',
    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
},
     (accessToken, refreshToken, profile, cb) => {

        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

// ---- GET  Routes -----

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/auth/google', 
   passport.authenticate('google', { scope: ['profile'] })
);

app.get('/auth/google/testing', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    console.log(profile);
    res.redirect('/secrets');
  });

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/secrets', (req, res) => {

    if (req.isAuthenticated()) {

        res.render("secrets");
    }
    else {
        res.redirect('/login');
    }
});

app.get('/submit', (req, res) => {
    res.render('submit');
});
app.get('/logout', (req, res) => {

    req.logout();
    res.redirect('/');
})

// ---- POST  Routes -----

app.post('/register', (req, res) => {

    User.register({ username: req.body.username }, req.body.password, (err, user) => {

        if (err) {

            console.error(err);
            res.redirect('/register');
        }
        else {

            passport.authenticate("local")(req, res, () => {
                res.redirect('/secrets');
            })
        }
    })
});

app.post('/login', (req, res) => {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, (err) => {

        if (err) {

            console.log(err);
        } else {

            passport.authenticate('local')(req, res, () => {
                res.redirect('/secrets');
            });
        }
    });
});

// ---- 

app.listen(PORT, () => {

    console.log(PORT);
});