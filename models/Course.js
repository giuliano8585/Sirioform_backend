const mongoose = require('mongoose');

const giornataSchema = new mongoose.Schema({
  dataInizio: { type: Date, required: true },
  dataFine: { type: Date, required: true },
  oraInizio: { type: String, required: true },
  oraFine: { type: String, required: true },
});

const progressiveCounterSchema = new mongoose.Schema({
  counter: { type: Number, default: 0 }
});
const ProgressiveCounter = mongoose.model('ProgressiveCounter', progressiveCounterSchema);
const generateProgressiveNumber = async (course) => {
  const datePart = course.giornate[0]?.dataInizio.toISOString().split('T')[0];
  let counterDoc = await ProgressiveCounter.findOne();
  if (!counterDoc) {
    counterDoc = new ProgressiveCounter({ counter: 1 });
  } else {
    counterDoc.counter += 1;
  }
  await counterDoc.save();
  const counterStr = counterDoc.counter.toString().padStart(5, '0');
  return `${course.tipologia}-${datePart}-${counterStr}`;
};


const courseSchema = new mongoose.Schema({
  tipologia: { type: mongoose.Schema.Types.ObjectId, ref: 'Kit', required: true },
  città: { type: String, required: true },   
  via: { type: String, required: true },
  numeroDiscenti: { type: Number, required: true },
  istruttore: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],   
  direttoreCorso:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sanitario', required: true }], 
  giornate: [giornataSchema], 
  isRefreshCourse:{type:Boolean},
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  discente: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Discente' }], 
  progressiveNumber: { type: String }, 
  status: { type: String, enum: ['active', 'unactive','update','end','complete','finalUpdate'], default: 'unactive' },
}, {
  timestamps: true 
});

courseSchema.pre('save', async function (next) {
  if (!this.progressiveNumber) {
    this.progressiveNumber = await generateProgressiveNumber(this);
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);
