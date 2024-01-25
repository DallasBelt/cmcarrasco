const express = require('express')
const patientsController = require('../controllers/patientsController')

const router = express.Router()

router.get('/list', patientsController.listPatients)
router.post('/save', patientsController.savePatient)
router.post('/actualizar', patientsController.actualizarPaciente)
router.post('/verifyID', patientsController.verifyID)
router.post('/verifyEmail', patientsController.verifyEmail)

module.exports = router;