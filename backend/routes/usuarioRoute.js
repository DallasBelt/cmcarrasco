const express = require('express');
const usuarioController = require('../controllers/usuarioController');

const router = express.Router();

router.post('/eliminar', usuarioController.eliminarUsuario);

module.exports = router;
