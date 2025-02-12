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
        CREATE TABLE IF NOT EXISTS rrt_package (

        id INT PRIMARY KEY AUTO_INCREMENT,
        pack_id INT UNIQUE,
        title VARCHAR(255) NOT NULL,
        picture VARCHAR(155),
        detail TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;

    const sqlPackage = `
        CREATE TABLE IF NOT EXISTS rrt_packages (

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
        CREATE TABLE IF NOT EXISTS rrt_transacction (

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
    res.send('<h2> Packages & Transactions Tables Created Successfully </h2>');
});

route.get('/createComplain', (req, res) => {


    const sqlComplaint = `
    CREATE TABLE IF NOT EXISTS rrt_complaint (
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

    res.send('<h1> Complaint Table Created Successfully </h1>');
});

route.get('/createForm', (req, res) => {


    const form = `  CREATE TABLE rrt_forms (
    form_id INT AUTO_INCREMENT PRIMARY KEY,
    form_name VARCHAR(255) NOT NULL,
    description TEXT,
    user_id VARCHAR(255),
    createdby VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`

    const fields = `CREATE TABLE rrt_fields (
    field_id INT AUTO_INCREMENT PRIMARY KEY,
    form_id INT NOT NULL,
    field_name VARCHAR(255) NOT NULL,
    field_type ENUM('text', 'number', 'email', 'textarea', 'select', 'checkbox', 'radio') NOT NULL,
    field_options TEXT,
    is_required BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES rrt_forms(form_id) ON DELETE CASCADE
);`

    const responses = `CREATE TABLE rrt_responses (
    response_id INT AUTO_INCREMENT PRIMARY KEY,
    form_id INT NOT NULL,
    client_ip VARCHAR(45),
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES rrt_forms(form_id) ON DELETE CASCADE
);`

    const respVaalvues = `CREATE TABLE rrt_response_Values (
    response_value_id INT AUTO_INCREMENT PRIMARY KEY,
    response_id INT NOT NULL,
    field_id INT NOT NULL,
    field_value TEXT NOT NULL,
    question_value TEXT,
    FOREIGN KEY (response_id) REFERENCES Responses(response_id) ON DELETE CASCADE,
    FOREIGN KEY (field_id) REFERENCES rrt_fields(field_id) ON DELETE CASCADE
);`



    db.query(form, (errRoles) => {
        if (errRoles) {
            console.log('Error creating roles table:', errRoles);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Form Table Created Successfully');

    });
    db.query(fields, (errRoles) => {
        if (errRoles) {
            console.log('Error creating roles table:', errRoles);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Form Fields Created Successfully');

    });
    db.query(responses, (errRoles) => {
        if (errRoles) {
            console.log('Error creating roles table:', errRoles);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Response Table Created Successfully');

    });
    db.query(respVaalvues, (errRoles) => {
        if (errRoles) {
            console.log('Error creating roles table:', errRoles);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Responcse Values Created Successfully');

    });

    res.send('<h2> Form Responses Table Created Successfully </h2>');
});

route.get('/createBooking', (req, res) => {


    const form = `CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    event_date DATE NOT NULL,
    event_location VARCHAR(255) NOT NULL,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`




    db.query(form, (errRoles) => {
        if (errRoles) {
            console.log('Error creating roles table:', errRoles);
            return res.status(500).send('Internal Server Error');
        }
        console.log('Booking Table Created Successfully');

    });


    res.send('<h2> Booking Table Created Successfully </h2>');
});



module.exports = route;