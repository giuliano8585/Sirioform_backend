const express = require('express');
const router = express.Router();
const sanitariosController = require('../controllers/sanitariosController');

router.post('/create', sanitariosController.createSanitario);
router.get('/', sanitariosController.getAllSanitarios); 
router.patch('/:id', sanitariosController.updateSanitario); 
router.delete('/:id', sanitariosController.deleteSanitario);

module.exports = router;
