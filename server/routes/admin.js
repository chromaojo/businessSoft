const express = require('express');
const route = express.Router();
const mail = require('../config/mail');
const path = require("path");
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { UserLoggin, AvoidIndex, AdminRoleBased } = require('../auth/auth');
const random = Math.floor(Math.random() * 99999);
const rando = Math.floor(Math.random() * 999999);
const rand = rando + "RrT" + random;
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
                return res.redirect('/logout');
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



// To get all the users for the admin
route.get('/users', UserLoggin, (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    const userId = req.params.userId;
    

    const sql = `
      SELECT * FROM royalreality.rrt_users;
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log('Error retrieving shipments:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.clearCookie('userAll');
        req.app.set('userAll', results)
        // res.json(results);
        const userAll = req.app.get('userAll');
        console.log("All Admin user detail is", userAll)
        res.render('user', { userData, userAll })
    });
});



// To get each user detail 
route.get('/users/:userId', UserLoggin, (req, res) => {
    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const userId = req.params.userId;

    // Retrieve user data from the database based on userId
    const sql = `
      SELECT * FROM royalreality.rrt_users WHERE user_id = ?;
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log('Error retrieving user data:', err);
            return res.status(500).send('Internal Server Error');
        }
        // Check if user exists
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }
        res.clearCookie('userOne');
        
        res.cookie('userOne', JSON.stringify({ ...results }));
        // res.json(results);
        
        const userO = req.cookies.userOne ? JSON.parse(req.cookies.userOne) : null;
        const userOne = userO[0]
        console.log(' UserOne details is', userOne)
        res.render('user-edit', { userData, userOne })
    });
});

// To edit each users role for the admin
route.post('/users/:userId/edit', UserLoggin, (req, res) => {
    const userId = req.params.userId;
    const newRole = req.body.role; // Assuming the role is sent in the request body

    // Update user role in the database
    const sql = `
      UPDATE royalreality.rrt_users 
      SET role = ?
      WHERE user_id = ?;
    `;

    db.query(sql, [newRole, userId], (err, results) => {
        if (err) {
            console.log('Error updating user role:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.clearCookie('userOne');
        res.redirect('/admin/users'); // Redirect to the list of users or any appropriate route
    });
});


// To get single Query 

route.get('/shipments/:userId', UserLoggin, (req, res) => {
    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userId = req.params.userId;
    

    const sql = `
      SELECT * FROM royalreality.rrt_shipments WHERE user_id = ?;
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log('Error retrieving shipments:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.clearCookie('userShip');
        req.app.set('userShip', results)
        // res.json(results);
        const userShip = req.app.get('userShip');
        console.log("The shipment history is", userShip)
        res.render('shipment', { userData, userShip })
    });
});



// To get all the shipments for the admin

route.get('/shipments', (req, res) => {
    const sql = `
        SELECT * 
        FROM royalreality.rrt_shipments;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.log('Error fetching shipments:', err);
            return res.status(500).send('Internal Server Error');
        }

        res.json(results);
    });
});





module.exports = route;



