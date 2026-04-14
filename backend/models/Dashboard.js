const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
  id: String,
  type: { type: String, enum: ['kpi', 'line', 'bar', 'pie', 'doughnut', 'scatter', 'area', 'heatmap', 'table', 'histogram'] },
  title: String,
  subtitle: String,
  x: Number, y: Number,
  w: Number, h: Number,
  config: {
    xAxis: String,
    yAxis: String,
    groupBy: String,
    aggregation: { type: String, enum: ['sum', 'avg', 'count', 'min', 'max'], default: 'sum' },
    colorScheme: String,
    showLegend: Boolean,
    showDataLabels: Boolean,
    filters: [{ column: String, operator: String, value: mongoose.Schema.Types.Mixed }]
  },
  kpiConfig: {
    metric: String,
    aggregation: String,
    compareWith: String,
    prefix: String,
    suffix: String,
    colorTheme: String
  },
  computedData: { type: mongoose.Schema.Types.Mixed }
});

const dashboardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dataset: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset', required: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  widgets: [widgetSchema],
  kpis: [{ type: mongoose.Schema.Types.Mixed }],
  aiGenerated: { type: Boolean, default: false },
  aiPrompt: { type: String },
  isPublic: { type: Boolean, default: false },
  thumbnail: { type: String },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

dashboardSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Dashboard', dashboardSchema);
