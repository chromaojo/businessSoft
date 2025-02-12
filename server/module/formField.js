const db = require('../config/db');

// Create a new form
exports.createForm = (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;
    
    if (userCookie) {
       
        const user_id = userCookie.user_id
        const { form_name, description, createdby } = req.body;
        
    try {
        const result =  db.query(
            'INSERT INTO rrt_forms (form_name, description, createdby, user_id) VALUES (?, ?, ?, ?)',
            [form_name, description, createdby , user_id]
        );
        res.redirect('/admin/all-forms')
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    } else {
        return res.status(401).redirect('/logout');
    }
    
};

// Create a new field for a form
exports.createField = async (req, res) => {
    const { field_name, field_type, field_options, is_requiredz } = req.body;
    const { form_id } = req.params;
    const is_required = req.body.is_requiredz === 'true'; // Convert string to boolean
    try { 
        const result = await db.query(
            `INSERT INTO rrt_fields (form_id, field_name, field_type, field_options, is_required)
             VALUES (?, ?, ?, ?, ?)`,
            [form_id, field_name, field_type, field_options, is_required]
        );
        res.redirect('/admin/fields/'+form_id)
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all forms
exports.getForms = async (req, res) => {

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;

    if (userCookie) {
        const sql = `
      SELECT * FROM royalreality.rrt_forms ORDER BY form_id DESC;
    `;

        db.query(sql, (err, results) => {
            if (err) {
                const error = 'Complain loading issues. Kindly go back to refresh'
                
                res.json('The error is ',error);
            }


            if (results) {

                const forms = results
                const userData = userCookie

                // res.status(500).json({'The result is ': results});
                return res.render('form', { userData, forms, });
            }

        })


    } else {
        return res.status(401).redirect('/logout');
    }

};

// Get fields by form ID
exports.getFieldsByFormId = async (req, res) => {
    const { form_id } = req.params;

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;


    if (userCookie) {
        const formData = await new Promise((resolve, reject) => {

            const sqls = `SELECT * FROM rrt_fields WHERE form_id = ? ORDER BY field_id ;`;
            db.query(sqls, [form_id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const sql = `
      SELECT * FROM rrt_forms WHERE form_id = ?;
    `;
    
       
        db.query(sql, [form_id], (err, results) => {
            if (err) {
                const error = 'Complain loading issues. Kindly go back to refresh'
                
                res.json('The error is ',error);
            }

            if (results) {

                const form = results[0]
                const userData = userCookie

                return res.render('formDetail', { userData, form, formData });
            }

        })


    } else {
        return res.status(401).redirect('/logout');
    }

    
   
};

// Get fields by form ID
exports.getFrontFormData = async (req, res) => {

    // const { form_id } = req.params;

    const form_id = 2;

    const userCookie = req.cookies.user ? JSON.parse(req.cookies.user) : null;


    if (!userCookie) {
        const formData = await new Promise((resolve, reject) => {

            const sqls = `SELECT * FROM rrt_fields WHERE form_id = ? ORDER BY field_id ;`;
            db.query(sqls, [form_id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });

        const sql = `
      SELECT * FROM rrt_forms WHERE form_id = ?;
    `;
    
       
        db.query(sql, [form_id], (err, results) => {
            if (err) {
                const error = 'Complain loading issues. Kindly go back to refresh'
                
                res.json('The error is ',error);
            }

            if (results) {
                const form = results[0]
                const userData = userCookie;
                return res.render('form-client', { userData, form, formData , layout :false});
            }

        })

    } else {
        return res.status(401).redirect('/logout');
    }

};

// Update a form
exports.updateForm = async (req, res) => {
    const { form_id } = req.params;
    const { form_name, description } = req.body;
    try {
        await db.query(
            `UPDATE Forms SET form_name = ?, description = ? WHERE form_id = ?`,
            [form_name, description, form_id]
        );
        res.json({ message: 'Form updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a form
exports.deleteForm = async (req, res) => {
    const { form_id } = req.params;
    try {
        await db.query('DELETE FROM rrt_forms WHERE form_id = ?', [form_id]);
        res.redirect('/admin/all-forms');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a form field
exports.deleteField = async (req, res) => {
    const { field_id } = req.params;
    try {
        await db.query('DELETE FROM rrt_forms WHERE field_id = ?', [field_id]);
        res.redirect('/admin/all-forms');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
