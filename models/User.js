const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QualificationSchema = new Schema({
  name: { type: String, required: true },
  expirationDate: { type: Date, required: true }, 
});

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'center', 'instructor'] },
  // Fields for all users
  email: { type: String },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  region: { type: String },
  // Fields for Center and Instructor roles
  name: { type: String }, 
  piva: { type: String },
  isActive: { type: Boolean, default: false },
  // Fields specific to Instructor
  firstName: { type: String },
  lastName: { type: String }, 
  fiscalCode: { type: String },
  brevetNumber: { type: String },
  qualifications: [QualificationSchema],
  sanitarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sanitario' }], 
  instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('User', UserSchema);
