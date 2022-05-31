require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();
const mongoose = require('mongoose');
const encrypter = require('mongoose-encryption');

mongoose.connect('mongodb://localhost:27017/usersDB');

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

const userSchema = new mongoose.Schema({
    email: 'string',
    password: 'string'
});

userSchema.plugin(encrypter, {secret: process.env.STR, encryptedFields: ["password"] });

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/secrets', (req, res) => {
    res.render('secrets');
});

app.get('/submit', (req, res) => {
    res.render('submit');
});

app.post('/register', (req, res) => {

    const email = req.body.username;
    const password = req.body.password;
    
    User.findOne({ email: email}, (err, user) => {
        if (!err){
            if (!user){
                const user = new User({
                    email: email,
                    password: password,
                });

                user.save();
                res.redirect('/')
            }
            else {
                console.log('User already exists');
                res.redirect('/login');
            }
        }
       else {
           console.log('error');
       }
    });
    });

app.post('/login', (req, res) => {

    const email = req.body.username;
    const password = req.body.password;

    User.findOne( {email: email}, (err, user) => {
        if (!err){
            if (!user){
                res.render('register')
            }
            else if(user.password === password){
                res.redirect('/secrets');
            }
            else {
                res.redirect('/login');
            }
        }
       else {
           console.log('error');
       }
    });
});

app.listen( PORT, () => {

    console.log( PORT);
});