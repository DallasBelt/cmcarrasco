const authService = require('../services/authService');

exports.login = async (req, res) => {
  // Without destrucuting
  // const email = req.body.correo;
  // const password = req.body.contrasenia;
  const { correo, contrasenia } = req.body;
  try {
    const result = await authService.login(correo, contrasenia);
    if (result.error) {
      return res.status(result.status).json({ message: result.error });
    }
    
    res.cookie('jwt', result.token, {
      httpOnly: false,
      // secure: process.env.NODE_ENV === 'production',
      secure: false,
      maxAge: 3600000,
      sameSite: 'Lax',
      path: '/'
    });
  
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        nombre_usuario: result.user.nombre_usuario,
        id_usuario: result.user.id_usuario,
        role_id: result.user.role_id
      }
    });
  } catch (error) {
      console.error('Error en la autenticación:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
  }
};