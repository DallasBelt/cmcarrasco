const express = require('express');
const router = express.Router();

const { obtenerUsuario } = require('../controllers/indexController');

router.get('/users', obtenerUsuario);

module.exports = router;