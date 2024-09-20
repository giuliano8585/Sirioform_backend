const express = require('express');
const router = express.Router();
const sanitariosController = require('../controllers/sanitariosController');

router.post('/create', sanitariosController.createSanitario);
router.get('/', sanitariosController.getAllSanitarios); 

module.exports = router;
