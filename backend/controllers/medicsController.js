const medicsService = require('../services/medicsService')

async function listMedics(req, res) {
  try {
    const resultado = await medicsService.listMedics()
    if (resultado.error) {
      return res.status(resultado.status).json(resultado.error)
    }

    return res.status(200).json(resultado)
  } catch (error) {
    console.error(error)
    return res.status(500).json('Error interno del servidor')
  }
}

async function guardarMedico(req, res) {
  try {
    // Obtiene los datos del paciente del cuerpo de la solicitud
    const datosMedico = req.body;

    // Llama al servicio para guardar el paciente en la base de datos
    const resultado = await medicsService.guardarMedico(datosMedico);

    // Verifica si se produjo un error al guardar el paciente
    if (resultado.error) {
      return res.status(resultado.status).json(resultado.error);
    }

    // Si se guardó correctamente, devuelve una respuesta exitosa
    return res.status(200).json('Medico guardado correctamente.');
  } catch (error) {
    console.error(error);
    return res.status(500).json('Error interno del servidor');
  }
}

async function actualizarMedico(req, res) {
  try {
    // Obtiene los datos del paciente del cuerpo de la solicitud
    const datosMedico = req.body;

    // Llama al servicio para guardar el paciente en la base de datos
    const resultado = await medicsService.actualizarMedico(datosMedico);

    // Verifica si se produjo un error al guardar el paciente
    if (resultado.error) {
      return res.status(resultado.status).json(resultado.error);
    }

    // Si se guardó correctamente, devuelve una respuesta exitosa
    return res.status(200).json('Medico actualizado correctamente.');
  } catch (error) {
    console.error(error);
    return res.status(500).json('Error interno del servidor');
  }
}

module.exports = {
  listMedics,
  guardarMedico,
  actualizarMedico
};