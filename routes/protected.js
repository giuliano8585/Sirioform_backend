const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/protected-endpoint', auth, (req, res) => {
  console.log('User in Request:', req.user);  
  res.json({ message: 'This is a protected endpoint', user: req.user });
});

module.exports = router;

