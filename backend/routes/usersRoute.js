const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.post('/eliminar', usersController.eliminarUsuario);

module.exports = router;
