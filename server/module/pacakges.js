const express = require('express');
const route = express.Router();
const info = require('../config/info')
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
        files: 4 // Limiting the number of files to 4
    }
}).array('pixz', 4);






// To View All Packages
const allPack = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    if (userCookie) {
        const sql = `
      SELECT * FROM royalreality.re_package ORDER BY id DESC;
    `;

        db.query(sql, (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userPack = results
                const userData = userCookie
                return res.render('index', { userData, userPack, info });
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
      SELECT * FROM royalreality.re_package ORDER BY id DESC;
    `;

        db.query(sql, (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userPack = results
                const userData = userCookie
                return res.render('admin-index', { userData, userPack, info });
            }

        })


    } else {
        return res.status(401).redirect('/logout');
    }
};

// To View All Commercial Packages
const allComPack = (req, res) => {

    const category = 'commercial'

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        const sql = `
      SELECT * FROM royalreality.re_package WHERE category = ? ORDER BY id DESC;
    `;

        db.query(sql, [category], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userPack = results
                const userData = userCookie
                return res.render('index', { userData, userPack, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};

// To View All Residentioal Packages
const allResPack = (req, res) => {

    const category = 'residential'
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        const sql = `
      SELECT * FROM royalreality.re_package ORDER BY id DESC;
    `;

        db.query(sql, [category], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userPack = results
                const userData = userCookie
                return res.render('index', { userData, userPack, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};

// To View All shortlet Packages
const allShortPack = (req, res) => {
    const Pack_type = 'shortlet'
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        const sql = `
      SELECT * FROM royalreality.re_package WHERE Pack_type = ? ORDER BY id DESC;
    `;

        db.query(sql, [Pack_type], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userPack = results
                const userData = userCookie
                return res.render('index', { userData, userPack, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};

// To View All Rented Packages
const allRentPack = (req, res) => {
    const action = 'rent'
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        const sql = `
      SELECT * FROM royalreality.re_package WHERE action = ? ORDER BY id DESC;
    `;

        db.query(sql, [action], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userPack = results
                const userData = userCookie
                return res.render('index', { userData, userPack, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};

// To View All Lease Packages
const allLeasePack = (req, res) => {
    const action = 'lease'
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        const sql = `
      SELECT * FROM royalreality.re_package WHERE action = ? ORDER BY id DESC;
    `;

        db.query(sql, [action], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userPack = results
                const userData = userCookie
                return res.render('index', { userData, userPack, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};

// To View All sSale Packages
const allSalePack = (req, res) => {
    const action = 'sale'
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        const sql = `
      SELECT * FROM royalreality.re_package WHERE action = ? ORDER BY id DESC;
    `;

        db.query(sql, [action], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {
                const userPack = results
                const userData = userCookie
                return res.render('index', { userData, userPack, info });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};




// To view only one package 

const onePack = (req, res) => {

    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        const sql = `
      SELECT * FROM royalreality.re_package WHERE id =?;
    `;

        db.query(sql, [id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('This is the dashboard Details : ', userData);

            if (results) {
                const userPack = results[0]
                console.log('Packages are ', userPack)
                res.render('Pack-one', { userData, userPack, info });
            }

        })
    }
};

// To view Admin Pack 
const oneAdPack = (req, res) => {

    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        const sql = `
      SELECT * FROM royalreality.re_package WHERE id =?;
    `;

        db.query(sql, [id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('This is the dashboard Details : ', userData);

            if (results) {
                const userPack = results[0]
                console.log('Packages are ', userPack)
                res.render('admin-Pack-one', { userData, userPack, info });
            }

        })
    }
};



// To Post package form from the frontend 
const createPack = (req, res) => {
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    try {
        upload(req, res, function (err) {
            if (err) {
                return res.send('Error uploading files.');
            }


            const { title, description, Pack_type, category, action, price, location } = req.body;

            let Pack_id = rando || random
            const pixz = req.files.map(file => file.filename);

            const Pack_status = 'active';
            const picture = '' + pixz + "";

            // Now you can handle the name, age, address, and pictures array
            // For example, save them to a database, send to another API, etc.

            db.query('INSERT INTO royalreality.re_package SET ?', { title, Pack_id, picture, description, Pack_type, category, action, Pack_status, price, location });
            res.redirect('/user/dashboard')
        });

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
            const sql = `DELETE FROM royalreality.re_package WHERE id = ?;`;
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



module.exports = { onePack, oneAdPack, allPack, allAdPack, deletePack, createPack, allLeasePack, allSalePack, allRentPack, allShortPack, allResPack, allComPack }
