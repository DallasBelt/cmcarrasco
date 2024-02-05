const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

router.get('/displayUsername', sessionController.displayUsername);
router.post('/logout', sessionController.logout);

module.exports = router;