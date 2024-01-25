const express = require('express');
const recordsController = require('../controllers/recordsController');

const router = express.Router();

// Ruta para iniciar sesión
router.post('/guardar', recordsController.guardar_historia_clinica);
router.post('/listar_por_medico', recordsController.listarHistoriaClinicaPorMedico);
router.post('/listar_pacientes_por_medico', recordsController.listarPacientesCorrespondientesAMedico);
router.post('/listar_historia_paciente', recordsController.listarHistoriaClinicaPorPaciente);
router.post('/listar_pacientes', recordsController.listarTodoPacientes);
router.post('/actualizar_tratamiento', recordsController.actualizarTratamiento);
router.post('/actualizar_examen_fisico', recordsController.actualizarExamenFisico);
router.post('/actualizar_antecedente', recordsController.actualizarAntecedente);
router.post('/actualizar_historia', recordsController.actualizarHistoria);

module.exports = router;
