const mongoose = require('mongoose');

const datasetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  originalName: { type: String, required: true },
  fileType: { type: String, enum: ['csv', 'xlsx', 'xls'], required: true },
  filePath: { type: String },
  rowCount: { type: Number, default: 0 },
  columnCount: { type: Number, default: 0 },
  columns: [{
    name: String,
    type: { type: String, enum: ['numeric', 'categorical', 'date', 'text'] },
    sampleValues: [mongoose.Schema.Types.Mixed],
    nullCount: Number,
    uniqueCount: Number
  }],
  previewData: { type: mongoose.Schema.Types.Mixed }, // first 100 rows
  stats: { type: mongoose.Schema.Types.Mixed },       // computed statistics
  size: { type: Number, default: 0 },                 // bytes
  status: { type: String, enum: ['processing', 'ready', 'error'], default: 'processing' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

datasetSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Dataset', datasetSchema);
