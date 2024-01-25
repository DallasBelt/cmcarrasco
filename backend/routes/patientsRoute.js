const express = require('express')
const pacienteController = require('../controllers/patientsController')

const router = express.Router()

router.post('/save', pacienteController.savePatient)
router.post('/actualizar', pacienteController.actualizarPaciente)
// router.post('/listar', pacienteController.listarPaciente);
router.get('/listar', pacienteController.listarPaciente)
router.post('/verifyID', pacienteController.verifyID)
router.post('/verifyEmail', pacienteController.verifyEmail)

module.exports = router;