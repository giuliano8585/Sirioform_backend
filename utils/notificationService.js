const Notification = require("../models/Notification");

const createNotification = async ({ message,category, senderId,userName, receiverId = null, isAdmin = false, forAllUsers = false }) => {
  try {
    const notification = new Notification({
      message,
      category,
      senderId,
      receiverId,
      userName,
      isAdmin,
      forAllUsers,
    });

    await notification.save();
    return notification;
  } catch (error) {
    throw new Error('Failed to create notification: ' + error.message);
  }
};

module.exports = {
  createNotification,
};
