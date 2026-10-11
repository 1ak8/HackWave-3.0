const mongoose = require('mongoose');

const RunStepSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  name: { type: String, required: true },
  intent: { type: String, required: true },
  action: { type: String, required: true },
  originalSelector: { type: String, required: true },
  resolvedSelector: { type: String },
  status: { type: String, enum: ['pending', 'running', 'passed', 'failed', 'healed'], default: 'pending' },
  durationMs: { type: Number, default: 0 },
  healingDetails: {
    wasHealed: { type: Boolean, default: false },
    confidence: { type: Number, default: 0 },
    reasoning: { type: String, default: '' },
    classification: { type: String, default: '' } // 'Harmless_UI_Change' or 'Genuine_Bug'
  },
  error: { type: String, default: null }
}, { _id: false });

const TestRunSchema = new mongoose.Schema({
  _id: { type: String },
  testId: { type: String, required: true },
  testTitle: { type: String, required: true },
  status: { type: String, enum: ['pending', 'running', 'passed', 'failed', 'healed'], default: 'pending' },
  mode: { type: String, enum: ['standard', 'mutated', 'chaos', 'bug_mode'], default: 'standard' },
  durationMs: { type: Number, default: 0 },
  steps: [RunStepSchema],
  healedCount: { type: Number, default: 0 },
  totalSteps: { type: Number, default: 0 },
  passedSteps: { type: Number, default: 0 },
  failedSteps: { type: Number, default: 0 },
  triageClassification: { type: String, default: 'Clean' }, // Clean, Harmless_Healed, Genuine_Bug_Halted
  logs: [{
    timestamp: { type: String },
    type: { type: String }, // 'info', 'warn', 'error', 'healing', 'success'
    message: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.models.TestRun || mongoose.model('TestRun', TestRunSchema);
