const medicsService = require('../services/medicsService')

exports.create = async (req, res) => {
  try {
    let medicData = req.body;
    
    medicData.especialidad = JSON.stringify(medicData.especialidad);
    medicData.schedule = JSON.stringify(medicData.schedule);
    medicData.shifts = JSON.stringify(medicData.shifts);

    const result = await medicsService.create(medicData);
    if (result.error) {
      return res.status(result.status).json(result.message);
    }
    res.status(200).json({ statusCodeValue: 200, body: 'Medic successfully created!' });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ statusCodeValue: 400, error: 'ID or email are already registered.' });
    } else {
      res.status(500).json({ statusCodeValue: 500, error: 'Internal server error.' });
    }
  }
};

exports.read = async (_, res) => {
  try {
    const result = await medicsService.read();
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
    const medicData = await medicsService.readByID(id);
    res.status(200).json(medicData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Error while trying to obtain medic data.');
  }
};

exports.update = async (req, res) => {
  try {
    const medicData = req.body;
    
    const result = await medicsService.update(medicData);

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    res.status(200).json({ message: 'Medic successfully updated!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const userID = req.body.id_usuario;
    console.log(userID)
    const result = await medicsService.delete(userID);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error while trying to delete medic.' });
  }
};