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
        pack_current VARCHAR(255),
        pack_duration VARCHAR(255),
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
route.get('/createPackage', (req, res) => {

    const sqlPackag = `
        CREATE TABLE IF NOT EXISTS royalreality.rrt_package (

        id INT PRIMARY KEY AUTO_INCREMENT,
        pack_id INT UNIQUE,
        title VARCHAR(255) NOT NULL,
        picture VARCHAR(155),
        detail TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;

    const sqlPackage = `
        CREATE TABLE IF NOT EXISTS royalreality.rrt_packages (

        id INT PRIMARY KEY AUTO_INCREMENT,
        pack_id INT,
        title VARCHAR(255) NOT NULL,
        social VARCHAR(255) NOT NULL,
        pages_no VARCHAR(255),
        email_no VARCHAR(255),
        users_no VARCHAR(155),
        e_payment VARCHAR(155),
        detail TEXT,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (pack_id) REFERENCES rrt_package(pack_id)
        );
        `;

    db.query(sqlPackag, (errRoles) => {
        if (errRoles) {
            console.log('Error creating roles table:', errRoles);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Package Created Successfully');
    });

    db.query(sqlPackage, (errAccounts) => {
        if (errAccounts) {
            console.log('Error creating accounts table:', errAccounts);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Transaction Created Successfully');
    });
   
    res.send('Packages & Package Item Tables Created Successfully');
});

// To create Transaction and packages 
route.get('/createSubscription', (req, res) => {


    const sqlTransaction = `
        CREATE TABLE IF NOT EXISTS royalreality.rrt_transacction (

        id INT PRIMARY KEY AUTO_INCREMENT,
        transaction_id VARCHAR(255),
        title VARCHAR(255),
        amount INT DEFAULT 0,
        details VARCHAR(255),
        name VARCHAR(255),
        phone_number VARCHAR(255),
        user_id VARCHAR(255),
        confirmed ENUM('confirmed', 'pending') DEFALUT 'pending',
        status ENUM('completed', 'not completed', 'waiting') DEFALUT 'waiting',
        FOREIGN KEY (user_id) REFERENCES rrt_users(user_id)
        );
        `;

        const sqlSub = `
        CREATE TABLE IF NOT EXISTS royalreality.rrt_subscription (
        id INT UNIQUE PRIMARY KEY AUTO_INCREMENT,
        pack_id INT UNIQUE,
        title VARCHAR(255) NOT NULL,
        price VARCHAR(255) ,
        user_id VARCHAR(255) UNIQUE, 
        picture VARCHAR(255) NOT NULL,
        Start_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        endb_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES rrt_users(user_id)
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
    db.query(sqlSub, (errAccounts) => {
        if (errAccounts) {
            console.log('Error creating accounts table:', errAccounts);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Saved Table Created Successfully');
    });
    res.send('Packages & Transactions Tables Created Successfully');
});

route.get('/createComplain', (req, res) => {


    const sqlComplaint = `
    CREATE TABLE IF NOT EXISTS royalreality.rrt_complaint (
      id INT AUTO_INCREMENT PRIMARY KEY,
      report_id VARCHAR(255) UNIQUE,
      name VARCHAR(255) NOT NULL,
      aacount_id VARCHAR(255) NOT NULL,
      number VARCHAR(255),
      title VARCHAR(255),
      complain TEXT,
      status ENUM('pending', 'solve') DEFAULT 'pending',
      user_id VARCHAR(255) NOT NULL,
      date VARCHAR(255),
      time VARCHAR(255)
    );
  `;





    db.query(sqlComplaint, (errRoles) => {
        if (errRoles) {
            console.log('Error creating roles table:', errRoles);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Complaint Table Created Successfully');

    });

    res.send('Complaint Table Created Successfully');
});



module.exports =route;