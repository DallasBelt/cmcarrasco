const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

router.post('/create', usersController.create);

module.exports = router;
