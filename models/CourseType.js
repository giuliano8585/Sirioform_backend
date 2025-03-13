const mongoose = require('mongoose');

const CourseType = new mongoose.Schema(
  {
    type: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CourseType', CourseType);
