const express = require('express');
const router = express.Router();
const patientsController = require('../controllers/patientsController');

router.post('/create', patientsController.create);
router.get('/read', patientsController.read);
router.post('/readByID', patientsController.readByID);
router.patch('/update', patientsController.update);

module.exports = router;