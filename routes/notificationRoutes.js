const express = require('express');
const auth = require('../middleware/auth');
const {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const router = express.Router();

router.get('/', auth, getNotifications);
router.patch('/:id/read', auth, markNotificationAsRead);
router.delete('/:id', auth, deleteNotification);

module.exports = router;
