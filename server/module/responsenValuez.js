const db = require('../config/db');

// Create a response
exports.createResponse = async (req, res) => {
    const { form_id, client_ip } = req.body;
    try {
        const [result] = await db.query(
            'INSERT INTO rrt_responses (form_id, client_ip) VALUES (?, ?)',
            [form_id, client_ip]
        );
        res.status(201).json({ response_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Add response values
exports.addResponseValues = async (req, res) => {
    const { response_id, values } = req.body; // `values` is an array of { field_id, field_value }
    try {
        const queries = values.map((v) =>
            db.query(
                'INSERT INTO Response_Values (response_id, field_id, field_value) VALUES (?, ?, ?)',
                [response_id, v.field_id, v.field_value]
            )
        );
        await Promise.all(queries);
        res.status(201).json({ message: 'Response values added successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get responses by form ID
exports.getResponsesByFormId = async (req, res) => {
    const { form_id } = req.params;
    try {
        const [responses] = await db.query('SELECT * FROM rrt_responses WHERE form_id = ?', [form_id]);
        res.json(responses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get response values by response ID
exports.getResponseValuesByResponseId = async (req, res) => {
    const { response_id } = req.params;
    try {
        const [responseValues] = await db.query(
            'SELECT * FROM Response_Values WHERE response_id = ?',
            [response_id]
        );
        res.json(responseValues);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a response
exports.deleteResponse = async (req, res) => {
    const { response_id } = req.params;
    try {
        await db.query('DELETE FROM rrt_responses WHERE response_id = ?', [response_id]);
        res.json({ message: 'Response deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
 