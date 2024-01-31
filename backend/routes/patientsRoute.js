const express = require('express')
const router = express.Router()
const patientsController = require('../controllers/patientsController')

router.get('/list', patientsController.listPatients)
router.post('/get', patientsController.getPatientByID)
router.post('/save', patientsController.savePatient)
router.put('/update', patientsController.updatePatient)
router.post('/verifyID', patientsController.verifyID)
router.post('/verifyEmail', patientsController.verifyEmail)

module.exports = router;