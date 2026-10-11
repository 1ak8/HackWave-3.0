const mongoose = require('mongoose');

const HealingLogSchema = new mongoose.Schema({
  _id: { type: String, default: () => `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` },
  runId: { type: String, required: true },
  testId: { type: String, required: true },
  stepOrder: { type: Number, required: true },
  stepName: { type: String, required: true },
  userIntent: { type: String, required: true },
  brokenSelector: { type: String, required: true },
  healedSelector: { type: String, required: true },
  confidence: { type: Number, required: true }, // e.g. 96 (%)
  strategyLayer: { type: String, required: true }, // Layer 1: Text, Layer 2: Role & Position, Layer 3: Semantic DOM
  classification: { 
    type: String, 
    enum: ['Harmless_UI_Change', 'Genuine_Bug'], 
    required: true 
  },
  reasoning: { type: String, required: true },
  domContext: {
    beforeSelector: { type: String },
    matchedElementHtml: { type: String },
    candidateCount: { type: Number, default: 1 }
  },
  resolvedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.HealingLog || mongoose.model('HealingLog', HealingLogSchema);
