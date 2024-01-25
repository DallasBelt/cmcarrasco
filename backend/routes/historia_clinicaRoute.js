const express = require('express');
const historia_clinica_Controller = require('../controllers/historia_clinicaController');

const router = express.Router();

// Ruta para iniciar sesión
router.post('/guardar', historia_clinica_Controller.guardar_historia_clinica);
router.post('/listar_por_medico', historia_clinica_Controller.listarHistoriaClinicaPorMedico);
router.post('/listar_pacientes_por_medico', historia_clinica_Controller.listarPacientesCorrespondientesAMedico);
router.post('/listar_historia_paciente', historia_clinica_Controller.listarHistoriaClinicaPorPaciente);
router.post('/listar_pacientes', historia_clinica_Controller.listarTodoPacientes);
router.post('/actualizar_tratamiento', historia_clinica_Controller.actualizarTratamiento);
router.post('/actualizar_examen_fisico', historia_clinica_Controller.actualizarExamenFisico);
router.post('/actualizar_antecedente', historia_clinica_Controller.actualizarAntecedente);
router.post('/actualizar_historia', historia_clinica_Controller.actualizarHistoria);

module.exports = router;
