const express = require('express');
const medicsController = require('../controllers/medicsController');
const router = express.Router();

// router.post('/listar', medicoController.listarMedicos);
router.get('/listMedics', medicsController.listMedics);
router.post('/saveMedics', medicsController.guardarMedico);
router.post('/updateMedics', medicsController.actualizarMedico);

module.exports = router;