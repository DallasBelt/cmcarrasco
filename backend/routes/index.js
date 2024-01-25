const express = require('express');
const router = express.Router();

const { obtenerUsuario } = require('../controllers/index.controller');

router.get('/usuarios', obtenerUsuario);

module.exports = router;