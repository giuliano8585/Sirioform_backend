const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
  try {

    let filter = { $or: [{ receiverId: req.user.id }, { forAllUsers: true }] };
    if (req.user.role=='admin') {
      filter.$or.push({ isAdmin: true });
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .populate('senderId');

      const notificationsWithAdmin = notifications.map(notification => {
        if (notification.isAdmin) {
          notification.senderId = 'admin';
        }
        return notification;
      });

    res.status(200).json(notificationsWithAdmin);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

// Mark a notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read' });
  }
};


// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
  const { category } = req.params;
  try {
    if (req.user.role === 'admin') {
    await Notification.updateMany({ category:category, isRead: false }, { isRead: true });
  } else {
    await Notification.updateMany({ receiverId: req.user.id, isRead: false }, { isRead: true });
  }
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notifications as read' });
  }
};

// Delete notifications based on category
const deleteNotificationsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    if (req.user.role === 'admin') {
      // Admin deletes by category
      await Notification.deleteMany({ category });
    } else {
      // User deletes their notifications only
      await Notification.deleteMany({ category, receiverId: req.user.id });
    }

    res.status(200).json({ message: `Notifications in category ${category} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notifications' });
  }
};

// Delete all notifications for the current user
const deleteAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ receiverId: req.user.id });
    res.status(200).json({ message: 'All notifications deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notifications' });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (req.user.role == 'admin') {
      await notification.deleteOne({_id:notificationId});
    }else{      
      await notification.deleteOne({_id:notificationId,receiverId: req.user.id});
    }
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.log('error: ', error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
};

module.exports = {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  deleteAllNotifications,
  markAllNotificationsAsRead,
  deleteNotificationsByCategory,
};


  // // Example: send a notification to the admin
  // await createNotification({
  //   message: `has created a new course.`,
  //   senderId: req.user.id,
  //   receiverId: adminId,  // admin's userId
  //   isAdmin: true,
  // });

  // // Example: send a notification to all users
  // await createNotification({
  //   message: `A new course is available.`,
  //   senderId: req.user.id,
  //   forAllUsers: true,  // notify all users
  // });

  // // Example: send a notification to the instructor of the course
  // await createNotification({
  //   message: `The status of your course has changed.`,
  //   senderId: req.user.id,
  //   receiverId: instructorId,  // instructor's userId
  // });
