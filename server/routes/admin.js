const express = require('express');
const route = express.Router();
const mail = require('../config/mail');
const path = require("path");
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const {allComplain, createComplain, allMyComplain}= require('../module/complaint')
const {allAdPack, oneAdPack, createPack, addPlan} = require('../module/packages');
const { UserLoggin, AvoidIndex, AdminRoleBased } = require('../auth/auth');
const random = Math.floor(Math.random() * 999999);
const rando = Math.floor(Math.random() * 999999);
const rand = rando + "RXGrT" + random;
const cookieParser = require('cookie-parser');
const formController = require('../module/formField');
const responseController = require('../module/responsenValuez');
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

    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const userCookie = userData
    console.log('The Data is ', userCookie)
    // const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        const user = db.query('SELECT *  FROM royalreality.rrt_users WHERE email = ?', [userData.email], async (error, result) => {

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


// Profile route
route.get('/profile', UserLoggin, (req, res) => {
    
    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    
    const userCookie = userData
   
    if (!userCookie) {
        res.redirect('/login');
    } else {
        const user = db.query('SELECT *  FROM royalreality.rrt_users WHERE email = ?', [userData.email], async (error, result) => {

            // console.log('This is the dashboard Details : ', userData);
            if (error) {
                
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
route.use('/edit', UserLoggin,  require('./edit'));



// To get all the users for the admin
route.get('/users', UserLoggin, (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    const userId = req.params.userId;
    

    const sql = `
      SELECT *  FROM royalreality.rrt_users;
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.log('Error retrieving users:', err);
            return res.status(500).send('<h2>Internal Server Error</h2>');
        }
        res.clearCookie('userAll');
        req.app.set('userAll', results)
        // res.json(results);
        const userAll = req.app.get('userAll');
        res.render('user', { userData, userAll })
    });
});



// To get each user detail 
route.get('/users/:userId', UserLoggin, (req, res) => {
    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    const userId = req.params.userId;

    // Retrieve user data  FROM the database based on userId
    const sql = `
      SELECT *  FROM royalreality.rrt_users WHERE user_id = ?;
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
        const userOne = userO["0"];
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

// Complaint Section 
route.get('/complaint', allMyComplain, );

route.post('/complaints/xXPpRyds', createComplain, (req , res)=>{
    res.redirect('/admin/complaint')
});



// Package Section 

route.get('/packages', allAdPack, );

route.get('/packages/:pack_id', oneAdPack, );

route.post('/createPack/', createPack, (req, res)=>{
    
} );

route.post('/createPackage', addPlan, (req, res)=>{
    res.redirect('/admin/packages')
} );

route.get('/create/package', (req, res)=>{
    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    res.render('pack-create',{userData});
})

route.get('/create/packaxXzMwW/:pack_id', (req, res)=>{
    const pack_id = req.params.pack_id
    const userData = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    res.render('pack-create1',{userData, pack_id});
})


// ?Form Routes 

// Form and Fields Routes
route.post('/forms/KxTtLvXx', formController.createForm);
route.post('/fieldz/ZxXTyGWPLRfD/:form_id', formController.createField);
route.get('/all-forms', formController.getForms);
route.get('/fields/:form_id', formController.getFieldsByFormId);
route.put('/forms/:form_id', formController.updateForm);
route.get('/forms/del/:form_id', formController.deleteForm);

// Responses and Response Values Routes

route.post('/responses', responseController.createResponse);
route.post('/responses/values', responseController.addResponseValues);
route.get('/responses/:form_id', responseController.getResponsesByFormId);
route.get('/responses/values/:response_id', responseController.getResponseValuesByResponseId);
route.delete('/responses/:response_id', responseController.deleteResponse);






module.exports = route;



