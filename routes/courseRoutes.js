const express = require('express');
const { createCourse, getCoursesByUser, getAllCourses } = require('../controllers/courseController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// Rotta per creare un nuovo corso
router.post('/', auth, createCourse);

// Rotta per ottenere i corsi dell'utente
router.get('/user-courses', auth, getCoursesByUser);

router.get('/', auth,isAdmin, getAllCourses);

module.exports = router;
