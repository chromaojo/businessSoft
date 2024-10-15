const express = require('express');
const route = express.Router();
// const info = require('../config/info')
const path = require("path");
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const random = Math.floor(Math.random() * 999999);
const rando = Math.floor(Math.random() * 99999);
const rand = rando + "FTL" + random;
const cookieParser = require('cookie-parser');
const session = require('express-session');


// MiDDLE WARES 
// Configure multer for file storage in 'Pack' directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/Pack/');
        // cb(null, path.join(__dirname, 'Pack'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        files: 2 // Limiting the number of files to 4
    }
}).array('pixz', 4);






// To View All Packages
const allPack = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    if (userCookie) {
        const sql = `
      SELECT * FROM royalreality.rrt_package ORDER BY id DESC;
    `;

        db.query(sql, (err, results) => {
            if (err) {
                const error = 'Unable To access packages';
                return res.render('error', userData, error)
            }


            if (results) {
                const userPack = results
                const userData = userCookie
                return res.render('packages', { userData, userPack });
            }

        })


    } else {
        return res.status(401).redirect('/logout');
    }
};

// To View All Packages
const allAdPack = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    if (userCookie) {
        const sql = `
      SELECT * FROM royalreality.rrt_package ORDER BY id DESC;
    `;

        db.query(sql, (err, results) => {
            if (err) {
                const error = 'Internal Package Server Error';
                return res.render('error', userData, error) 
                
            }


            if (results) {
                const userPack = results
                const userData = userCookie
                return res.render('packages-admin', { userData, userPack });
            }

        })


    } else {
        return res.status(401).redirect('/logout');
    }
};

// To view only one package 

const onePack = async (req, res) => {

    const id = req.params.pack_id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    console.log('Ensure you see the id ', id)
    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        const product = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM royalreality.rrt_packages WHERE pack_id =?`;
            db.query(sqls, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        // Execute the query
        const userPack = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM royalreality.rrt_package WHERE pack_id =?`;
            db.query(sqls, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        console.log('Ensure you see the pack', userPack)

        res.render('pack-one', { userData, userPack, product, });
    }

};

// To view Admin Pack 
const oneAdPack = async (req, res) => {

    const id = req.params.pack_id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {

        const product = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM royalreality.rrt_packages WHERE pack_id =?`;
            db.query(sqls, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        // Execute the query
        const userPacks = await new Promise((resolve, reject) => {
            const sqls = `SELECT * FROM royalreality.rrt_package WHERE pack_id =?`;
            db.query(sqls, [id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
        const userPack = userPacks[0]

        res.render('pack-admin-one', { userData, userPack, product });

    }
};



// To Post package form from the frontend 
const createPack = (req, res, next) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    try {
        upload(req, res, function (err) {
            if (err) {
                return res.send('Error uploading files.');
            }


            const { title, detail } = req.body;

            const pack_id = Math.floor(Math.random() * 99999);
            const pixz = req.files.map(file => file.filename);
            const picture = '' + pixz + "";
            console.log('This is a simple pixz ', pixz)
            // Now you can handle the name, age, address, and pictures array
            // For example, save them to a database, send to another API, etc.

            db.query('INSERT INTO royalreality.rrt_package SET ?', { title, pack_id, picture, detail });
            res.redirect('/admin/create/packaxXzMwW/' + pack_id)

        });

    } catch (error) {
        console.log('package Form Error :', error)
    }

}


// To Post package form from the frontend 
const addPlan = (req, res, next) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    try {

        const { title, detail, social, pages_no, email_no, users_no, price, pack_id } = req.body;

        db.query('INSERT INTO royalreality.rrt_packages SET ?', { title, detail, social, pages_no, email_no, users_no, price, pack_id });
        next();


    } catch (error) {
        console.log('package Form Error :', error)
    }

}




// To delete a package content


const deletePack = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {

        try {
            const id = req.params.id;

            // Perform the deletion
            const sql = `DELETE FROM royalreality.rrt_package WHERE id = ?;`;
            db.query(sql, [id], (err, result) => {
                if (err) {

                    return res.status(500).send('Error deleting package');
                }
                res.redirect('/admin/Packs')
            });


        } catch (err) {
            console.error('Error handling /delete-task-content/:id route:', err);
            res.status(500).send('Internal Server Error');
        }


    } else {
        res.send('Cannot Delete This package')
    }
};



module.exports = { onePack, oneAdPack, allPack, allAdPack, deletePack, createPack, addPlan }
