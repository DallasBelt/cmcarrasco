const express = require('express');
const medicoController = require('../controllers/medicoController');
const router = express.Router();

// router.post('/listar', medicoController.listarMedicos);
router.get('/get_medics', medicoController.getMedics);
router.post('/guardar', medicoController.guardarMedico);
router.post('/actualizar', medicoController.actualizarMedico);

module.exports = router;