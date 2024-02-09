const patientsService = require('../services/patientsService')

exports.create = async (req, res) => {
  try {
    const patientData = req.body
    const result = await patientsService.create(patientData)
    if (result.error) {
      return res.status(result.status).json(result.message)
    }
    res.status(200).json({ statusCodeValue: 200, body: 'Paciente registrado con éxito' })
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ statusCodeValue: 400, error: 'La cédula o correo ya está registrado.' })
    } else {
      res.status(500).json({ statusCodeValue: 500, error: 'Error interno del servidor' })
    }
  }
};

exports.read = async (_, res) => {
  try {
    const result = await patientsService.read()
    if (result.error) {
      return res.status(result.status).json(result.message);
    }
    return res.status(200).json(result);
  } catch (error) {
      return res.status(500).json({ statusCodeValue: 500, error: error.message });
  }
};

exports.readByID = async (req, res) => {
  try {
    const id = req.body.cedula;
    const patientData = await patientsService.readByID(id);
    res.status(200).json(patientData);
  } catch (error) {
    console.error('Error en el controlador:', error.message);
    res.status(500).send('Error al obtener datos del paciente');
  }
};

exports.update = async (req, res) => {
  try {
    const patientData = req.body;
    
    const result = await patientsService.update(patientData);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.status(200).json({ message: 'Paciente actualizado correctamente.' });
  } catch (error) {
    console.error('Error en la actualización del paciente:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};