const db = require('../config/db');
let random = Math.floor(Math.random() * 900999999);
let rando = Math.floor(Math.random() * 99999899);
const rand = rando + "TtXxL" + random;






// To View All Complain for one person
const allComplain = (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const userData = userCookie

    if (userCookie) {
        const sql = `SELECT * FROM royalreality.rrt_complaint ORDER BY id DESC;`;
        db.query(sql, (err, results) => {
            if (err) {
                const error = 'Complain loading issues. Kindly go back to refresh'
                return res.render('error', userData, error)
            }
            if (results) {

                const userComplain = results

                return res.render('admin-complaints', { userData, userComplain, });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};

// To View All Complain for one person
const allMyComplain = (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);
    const userId = userCookie.user_id

    if (userCookie) {
        const sql = `
      SELECT * FROM royalreality.rrt_complaint WHERE user_id = ? ORDER BY id DESC;
    `;

        db.query(sql, [userId], (err, results) => {
            if (err) {
                const error = 'Complain loading issues. Kindly go back to refresh'
                return res.render('error', userData, error)
            }


            if (results) {

                const userComplain = results
                const userData = userCookie
                return res.render('complaint-my', { userData, userComplain, });
            }

        })


    } else {
        return res.status(401).redirect('/user/logout');
    }
};


// To view only one Complain 

const oneComplain = (req, res) => {

    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie
    if (!userCookie) {
        res.redirect('/logout');
    } else {
        const sql = `
      SELECT * FROM royalreality.rrt_complaint WHERE id =?;
    `;

        db.query(sql, [id], (err, results) => {
            if (err) {
                const error = 'Complain loading issues. Kindly go back to refresh'
                return res.render('error', userData, error)
            }
            console.log('This is the dashboard Details : ', userData);

            if (results) {
                const useComplain = results[0]
                console.log('Complain Items ', useComplain)
                res.render('complaint-my', { userData, useComplain, });
            }

        })
    }
};



// To Post Complain form from the frontend 
const createComplain = (req, res, next) => {
    const id = req.params.id;
    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    const userData = userCookie

    if (userData) {
        try {
            const sql = `
            SELECT * FROM royalreality.rrt_complaint WHERE id = ?;
          `;

            db.query(sql, [id], (err, results) => {
                if (err) {
                    const error = 'Complain loading issues. Kindly go back to refresh'
                    return res.render('error', userData, error)
                }
                const { title, name, complain, number } = req.body

                const user_id = userData.user_id
                let report_id = Math.floor(Math.random() * 9900999999);
                const aacount_id = userData.account_id
                console.log('This is the Report number ', report_id);
                db.query('INSERT INTO royalreality.rrt_complaint SET ?', { title, user_id, name, complain, number, aacount_id, report_id });

                next();
            })

        } catch (err) {

            const error = 'Complain creation issues.'
            return res.render('error', userData, error)
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


// To delete a Complain content


const deleteComplain = (req, res, next) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    req.app.set('userData', userCookie);

    if (userCookie) {

        try {
            const id = req.params.id;
            // Perform the deletion
            const sql = `DELETE FROM royalreality.rrt_complaint WHERE id = ?;`;
            db.query(sql, [id], (err, result) => {
                if (err) {

                    const error = 'Complain deleting issues.'
                    return res.render('error', userData, error)
                }
                // Check if any rows were affected
                if (result.affectedRows === 0) {
                    return res.status(404).send('Complain content not found');
                }

            });

            return next();
        } catch (err) {

            const error = 'Error handling /delete-task-content/:id route:';
            return res.render('error', userData, error)
        }
    } else {
        
        const error = 'Cannot Delete This Complain';
        return res.render('error', userData, error)  
    }
};



module.exports = { oneComplain, allComplain, allMyComplain, deleteComplain, createComplain }
