const express = require('express')
const appointmentsController = require('../controllers/appointmentsController')
const router = express.Router()

router.get('/listAppointments', appointmentsController.listAppointments)
router.post('/listar_fechas', appointmentsController.listarFechas)
router.post('/guardar', appointmentsController.guardarCitas)
router.post('/citas_del_dia', appointmentsController.listarCitaDelDia)
router.post('/citas_por_medico', appointmentsController.listarCitasPorMedico)
router.post('/citas_por_medico_diaActual', appointmentsController.listarCitasPorMedicoDiaActual)
router.post('/citas_del_dia_paciente', appointmentsController.listarCitasDelDiaPaciente)
router.post('/citas_del_paciente', appointmentsController.listarCitasDelPaciente)
router.post('/actualizar', appointmentsController.actualizarCita)
router.post('/eliminar', appointmentsController.eliminarCita)

module.exports = router;