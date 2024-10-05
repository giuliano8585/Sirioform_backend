const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true }, 
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', }, 
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  isAdmin: { type: Boolean, default: false }, 
  isRead: { type: Boolean, default: false }, 
  category:{type: String},
  forAllUsers: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true 
});

module.exports = mongoose.model('Notification', notificationSchema);
