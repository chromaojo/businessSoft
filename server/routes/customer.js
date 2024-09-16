const express = require('express');
const route = express.Router();
const mail = require('../config/mail');
const path = require("path");
const db = require('../config/db');

const { UserLoggin, AvoidIndex, AdminRoleBased } = require('../auth/auth');
const random = Math.floor(Math.random() * 99999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "RRT" + random;
const cookieParser = require('cookie-parser');
const session = require('express-session');



route.use(
    session({
        secret: `Hidden_Key`,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    })
);
route.use(express.json())




// Dashboard route
route.get('/dashboard', (req, res) => {
    const userData = req.app.get('userData');
    const userCookie = userData
    // const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        const user = db.query('SELECT * FROM royalreality.rrt_users WHERE email = ?', [userData.email], async (error, result) => {

            console.log('This is the dashboard Details : ', userData);
            if (error) {
                console.log(" Login Error :", error);
                return res.redirect('/logouts');
            }
            if (result) {
                res.render('index', { userData, });
            }

        })
    }
});

// Dashboard route
route.get('/profile', UserLoggin, (req, res) => {
    const userData = req.app.get('userData');
    const userCookie = userData
    console.log('Here is my Dashboard Data', userCookie);
    if (!userCookie) {
        res.redirect('/login');
    } else {
        const user = db.query('SELECT * FROM royalreality.rrt_users WHERE email = ?', [userData.email], async (error, result) => {

            // console.log('This is the dashboard Details : ', userData);
            if (error) {
                console.log(" Login Error :", error);
                return res.redirect('/user/logout');
            }
            if (result) {
                res.render('profile', { userData, });
            }

        })
    }
});

// To get the editing Page 

route.get('/edit', UserLoggin, (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    res.render('profileEdit', { userData, })
})



// Tp Update New Account Details 
route.use('/edit', require('./edit'));







module.exports = route;