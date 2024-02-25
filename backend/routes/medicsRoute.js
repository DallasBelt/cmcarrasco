const express = require('express');
const medicsController = require('../controllers/medicsController');
const router = express.Router();

router.post('/create', medicsController.create);
router.get('/read', medicsController.read);
router.post('/readByID', medicsController.readByID);
router.patch('/update', medicsController.update);
router.delete('/delete', medicsController.delete);

module.exports = router;