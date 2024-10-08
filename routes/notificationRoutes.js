const express = require('express');
const auth = require('../middleware/auth');
const {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  deleteAllNotifications,
  markAllNotificationsAsRead,
  deleteNotificationsByCategory,
} = require('../controllers/notificationController');
const router = express.Router();

router.get('/', auth, getNotifications);
router.patch('/:id/read', auth, markNotificationAsRead);
router.patch('/read-all/:category', auth, markAllNotificationsAsRead);
router.delete('/:id', auth, deleteNotification);
router.delete('/delete-all', auth, deleteAllNotifications); 
router.delete('/delete-category/:category', auth, deleteNotificationsByCategory);

module.exports = router;
