const express = require('express');
const router = express.Router();
const patientsController = require('../controllers/patientsController');

router.post('/create', patientsController.create);
router.get('/read', patientsController.read);
// router.post('/getByID', patientsController.getByID);
// app.post('/create', function(req, res){
//   patientsController.create
// });
// router.put('/update', patientsController.updatePatient);
// router.post('/verifyID', patientsController.verifyID);
// router.post('/verifyEmail', patientsController.verifyEmail);

module.exports = router;