const express = require('express');
const formController = require('../module/formField');
const responseController = require('../module/responsenValuez');

const router = express.Router();

// Form and Fields Routes
router.post('/forms', formController.createForm);
router.post('/fields', formController.createField);
router.get('/forms', formController.getForms);
router.get('/fields/:form_id', formController.getFieldsByFormId);
router.put('/forms/:form_id', formController.updateForm);
router.delete('/forms/:form_id', formController.deleteForm);

// Responses and Response Values Routes
router.post('/responses', responseController.createResponse);
router.post('/responses/values', responseController.addResponseValues);
router.get('/responses/:form_id', responseController.getResponsesByFormId);
router.get('/responses/values/:response_id', responseController.getResponseValuesByResponseId);
router.delete('/responses/:response_id', responseController.deleteResponse);

module.exports = router;
