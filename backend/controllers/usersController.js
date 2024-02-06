const usersService = require('../services/usersService')

exports.create = async (req, res) => {
  try {
    const userData = req.body;

    const userId = await usersService.create(userData);

    res.status(200).json({ message: 'Usuario guardado con éxito', id_usuario: userId });
  } catch (error) {
    console.error('Error en guardarUsuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};