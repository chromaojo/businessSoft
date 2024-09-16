const express = require('express');
const route = express.Router();
const path = require("path");
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const random = Math.floor(Math.random() * 99999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "RrT" + random;
const session = require('express-session');
const { AvoidIndex, UserLoggin} = require('../auth/auth');



route.use(
    session({
        secret: `Hidden_Key`,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    })
);
route.use(express.json())





// Home Page 
route.get('/', AvoidIndex, (req, res) => {


    res.sendFile(path.join(__dirname, "../../statics", 'index.html'));
})


// To register a new account 
route.get('/register', AvoidIndex, (req, res) => {

    res.sendFile(path.join(__dirname, "../../statics", 'signUp.html'));
})

// Register new Users 


route.get('/login', AvoidIndex, (req, res) => {
    
    res.sendFile(path.join(__dirname, "../../statics", 'login.html'));
})

// Register new user 
route.post('/register', (req, res) => {
    const { email, password, password1, surname, othername, username, address, phone_number } = req.body;

    db.query('SELECT * FROM royalreality.rrt_users WHERE email = ?', [email], async (error, result) => {
        if (error) { console.log("Customized Error ", error); }
        if (result.length > 0) {
            return res.status(401).json({
                message: 'Email Already Taken'
            })
        } else if (password == password1) {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query('INSERT INTO royalreality.rrt_users SET ?', { email: email, password: hashedPassword, user_id: rand }, (error, result) => {
                if (error) {
                    console.log('A Registeration Error Occured ', error);
                } else {
                    // const messages = {
                    //     from: {
                    //         name: 'FASTTRAC INTERNATIONAL',
                    //         address: 'felixtemidayoojo@gmail.com',
                    //     },
                    //     to: email,
                    //     subject: "Welcome To Fasttrac Logistics",
                    //     text: `Welcome to FASTTRAC INT'L, \n \n  Your FASTTRAC Account has been opened successfully . \n Ensure that Your Password is kept safe. Incase of any compromise, ensure you change or optimizee the security on your application.`,
                    // }
                    // mail.sendIt(messages)

                    // To create the account table into the user 
                    db.query('INSERT INTO royalreality.rrt_accounts SET ?', { user_id: rand, email: email, account_id: rando, account_balance: 0, surname: surname, othername: othername, username: username, address: address, phone_number: phone_number });

                    return res.redirect('/login');
                }
               
            });


        } else {
            return res.redirect('/register');
        }

    })

});


// Login route
route.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if the user and account details with the provided email exists
    const sqlGetUserWithAccount = `
       SELECT 
         u.user_id,
         u.password,
         u.email,
         u.role,
         a.account_id,
         a.account_balance,
         a.phone_number,
         a.surname,
         a.othername,
         a.username,
         a.address,
         a.email as account_email
       FROM royalreality.rrt_users u
       LEFT JOIN royalreality.rrt_accounts a ON u.user_id = a.user_id
       WHERE u.email = ?;
     `;
    db.query(sqlGetUserWithAccount, [email], async (error, result) => {
        if (error) {

            console.log('The eroor is ',error)
            return res.status(500).json({
                message: 'Internal Server Login Error'
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                message: 'Invalid Email or Password'
            });
        }
        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, result[0].password);
        if (!isPasswordValid) {
            // Password is invalid
            return res.status(401).json({
                message: 'Invalid Email or Password'
            });

        }
        delete result[0].password

        req.app.set('userData', result[0]) 
        const userWithAccount = result[0];
         
        res.cookie('user', JSON.stringify({ ...userWithAccount }));
        // req.session.userId = result[0].user_id
        res.redirect('/user/dashboard');
    });
});



// Logout route
route.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        delete userData
        res.clearCookie('user');
        if (err) {
            console.error(err);
            res.status(500).send('Error logging out');
        } else {
            res.redirect('/login');
        }
    });
});









module.exports = route;