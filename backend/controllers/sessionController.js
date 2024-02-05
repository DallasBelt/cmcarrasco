const sessionService = require('../services/sessionService');

exports.displayUsername = async (req, res) => {
  try {
    const username = await sessionService.displayUsername(req.user.id_usuario);
    res.json(username);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener información del usuario' });
  }
};

exports.logout = (_, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Cierre de sesión exitoso' });
};