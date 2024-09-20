const express = require('express');
const router = express.Router();
const {
  login,
  getLoggedInInstructor,
  getLoggedInCenter,
} = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', login);
router.get('/instructors/me', auth, getLoggedInInstructor);
router.get('/centers/me', auth, getLoggedInCenter);

module.exports = router;
