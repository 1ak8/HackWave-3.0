const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  name: { type: String, required: true },
  intent: { type: String, required: true },
  action: { type: String, enum: ['click', 'fill', 'navigate', 'assert'], required: true },
  selector: { type: String, required: true },
  value: { type: String, default: '' },
  description: { type: String, default: '' }
}, { _id: false });

const TestCaseSchema = new mongoose.Schema({
  _id: { type: String, default: () => `test_${Date.now()}` },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  targetUrl: { type: String, required: true },
  intent: { type: String, required: true },
  steps: [StepSchema],
  tags: [{ type: String }],
  isSample: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.TestCase || mongoose.model('TestCase', TestCaseSchema);
