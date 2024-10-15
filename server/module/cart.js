const express = require('express');
const route = express.Router();
const info = require('../config/info')
const path = require("path");
const db = require('../config/db');
const { UserLoggin, AvoidIndex, AdminRoleBased } = require('../auth/auth');
const random = Math.floor(Math.random() * 9999999);
const rando = Math.floor(Math.random() * 9999999);
const rand = rando + "RRTXL" + random;
const cookieParser = require('cookie-parser');
const session = require('express-session');





// To View All Cart for one person
const allCart = (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const userId = userCookie.user_id
    if (userCookie) {
        const sql = `
      SELECT * FROM ecommerce.ec_Cart WHERE user_id = ? ORDER BY id DESC;
    `;

        db.query(sql, [userId], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }


            if (results) {

                const userCart = results
                const userData = userCookie
                return res.render('cart-all', { userData, userCart, info});
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};



// To view only one Cart 

const oneCart = (req, res) => {

    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        const sql = `
      SELECT * FROM ecommerce.ec_Cart WHERE id =?;
    `;

        db.query(sql, [id], (err, results) => {
            if (err) {
                console.log('Login Issues :', err);
                return res.status(500).send('Internal Server Error');
            }
            console.log('This is the dashboard Details : ', userData);

            if (results) {
                const userCart = results[0]
                console.log('Cart Items', userCart)
                res.render('Cart-one', { userData, userCart, info });
            }

        })
    }
};



// To Post cart from the frontend 
const createCart = (req, res, next) => {
    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    if (userData) {
        try {
            const sql = `
            SELECT * FROM ecommerce.ec_products WHERE id = ?;
          `;

            db.query(sql, [id], (err, result) => {
                if (err) {
                    console.log('Login Issues :', err);
                    return res.status(500).send('Internal Server Error');
                }

                const { title, price, picture, prod_id, quantity } = result[0]
                const sql = `
            SELECT prod_id FROM ecommerce.ec_cart WHERE prod_id = ?;
          `;


                db.query(sql, [prod_id], (err, results) => {
                    if (err) {
                        console.log('Login Issues :', err);
                        return res.status(500).send('Internal Server Error');
                    }
                    if (results.length > 0) {
                        const messages= 'Product Already Added To Cart'
                        const link = '/user/dashboard'
                        res.render('warning',{messages, userData, info, link})
                    } else { 

                        const pro_link = '/user/product-zZkKqQP/' + id;
                        const user_id = userData.user_id

                        console.log('This is the product price ', price);
                        // Try To check if the product has already been added before  before inserting
                        db.query('INSERT INTO ecommerce.ec_cart SET ?', { title, pro_link, price, user_id, quantity ,picture, prod_id });

                        return next();
                    }
                })
                // This is the end 

                
            })

        } catch (error) {
            console.log('Archive Form Error :', error)
        }

    } else {
        res.json('Added Successfully');
    }

}


// To get each User's Shipment Query 
const UserLoggi = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {
        return next();

    } else {
        return res.status(401).redirect('/user/logout');
    }
};


// To delete a Cart content


const deleteCart = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {

        try {
            const id = req.params.prod_id;
            // Perform the deletion
            const sql = `DELETE FROM ecommerce.ec_cart WHERE prod_id = ?;`;
            db.query(sql, [id], (err, result) => {
                if (err) {
                    console.error('Error deleting Cart:', err);
                    return res.status(500).send('Internal Server Error');
                }
                // Check if any rows were affected
                if (result.affectedRows === 0) {
                    return res.status(404).send('Cart content not deleted');
                }
                return next();

            });


        } catch (err) {
            console.error('Error handling /delete-task-content/:id route:', err);
            res.status(500).send('Internal Server Error');
        }


    } else {
        res.send('Cannot Delete This Cart')
    }
};



module.exports = { oneCart, allCart, deleteCart, createCart }
