const express = require('express');
const {
  createCourse,
  getCoursesByUser,
  getAllCourses,
  updateCourseStatus,
  assignDescente,
  getCourseById,
  removeDiscente,
  updateCourse,
  deleteCourse,
  getSingleCourseById,
} = require('../controllers/courseController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// Rotta per creare un nuovo corso
router.post('/', auth, createCourse);

// Rotta per ottenere i corsi dell'utente
router.get('/user-courses', auth, getCoursesByUser);

router.get('/user-courses/:id', auth, getCourseById);
router.get('/user-course/:id', auth, getSingleCourseById);

router.get('/', auth, isAdmin, getAllCourses);

router.patch('/courses/:courseId/status', auth, updateCourseStatus);

router.patch('/assign-discente', assignDescente);

router.patch('/remove-discente', removeDiscente);

router.patch('/courses/:courseId',auth, updateCourse);

router.delete('/courses/:courseId', deleteCourse);



module.exports = router;
