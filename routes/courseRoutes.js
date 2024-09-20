const express = require('express');
const { createCourse, getCoursesByUser } = require('../controllers/courseController');
const auth = require('../middleware/auth');

const router = express.Router();

// Rotta per creare un nuovo corso
router.post('/', auth, createCourse);

// Rotta per ottenere i corsi dell'utente
router.get('/', auth, getCoursesByUser);

module.exports = router;
