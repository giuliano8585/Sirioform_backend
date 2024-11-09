const mongoose = require('mongoose');

const KitSchema = new mongoose.Schema({
  profileImage: String,
  code: { type: String, required: true },
  type: { type: String, required: true },
  isRefreshKit: { type: Boolean, required: true,default:false },
  isForInstructor: { type: Boolean, required: true,default:false },
  description: { type: String, required: true },
  cost1: { type: Number, required: true },
  cost2: { type: Number, required: true },
  cost3: { type: Number, required: true }
});

module.exports = mongoose.model('Kit', KitSchema);

