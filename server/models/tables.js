const express = require('express');
const route = express.Router();
const mail = require('../config/mail');
const path = require("path");
const db = require('../config/db');
const random = Math.floor(Math.random() * 99999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "RRT" + random;





// To create Table for user and Account 
route.get('/createUser', (req, res) => {

    const sqlUsers = `
        CREATE TABLE IF NOT EXISTS royalreality.rrt_users (

        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id VARCHAR(255) UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'customer') DEFAULT 'customer'
        );
        `;

    const sqlAccounts = `
        CREATE TABLE IF NOT EXISTS royalreality.rrt_accounts (
        account_id VARCHAR(255) UNIQUE PRIMARY KEY,
        account_balance INT DEFAULT 0,
        phone_number VARCHAR(255),
        whatsapp INT,
        surname VARCHAR(255),
        othername VARCHAR(255),
        username VARCHAR(255) UNIQUE,
        address VARCHAR(255),
        email VARCHAR(255) NOT NULL UNIQUE,
        user_id VARCHAR(255) UNIQUE,
        FOREIGN KEY (user_id) REFERENCES rrt_users(user_id)
        );
        `;

    db.query(sqlUsers, (errRoles) => {
        if (errRoles) {
            console.log('Error creating roles table:', errRoles);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Users Created Successfully');
        
    });
    db.query(sqlAccounts, (errAccounts) => {
        if (errAccounts) {
            console.log('Error creating accounts table:', errAccounts);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Accounts Created Successfully');
        res.send('Tables Created Successfully');
    });
    
});


// To create Transaction and packages 
route.get('/createTrans', (req, res) => {


    const sqlPackage = `
        CREATE TABLE IF NOT EXISTS royalreality.rrt_users (

        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id VARCHAR(255) UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'staff', 'customer') DEFAULT 'customer'
        );
        `;

    const sqlTransaction = `
        CREATE TABLE IF NOT EXISTS royalreality.rrt_accounts (
        account_id VARCHAR(255) UNIQUE PRIMARY KEY,
        account_balance INT DEFAULT 0,
        phone_number VARCHAR(255),
        whatsapp INT,
        surname VARCHAR(255),
        othername VARCHAR(255),
        username VARCHAR(255) UNIQUE,
        address VARCHAR(255),
        email VARCHAR(255) NOT NULL UNIQUE,
        user_id INT UNIQUE,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        );
        `;

    db.query(sqlPackage, (errRoles) => {
        if (errRoles) {
            console.log('Error creating roles table:', errRoles);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Package Created Successfully');
    });

    db.query(sqlTransaction, (errAccounts) => {
        if (errAccounts) {
            console.log('Error creating accounts table:', errAccounts);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Transaction Created Successfully');
    });
    res.send('Packages & Transactions Tables Created Successfully');
});




module.exports =route;