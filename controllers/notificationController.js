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

    res.status(200).json(notifications);
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

module.exports = {
  getNotifications,
  markNotificationAsRead,
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
