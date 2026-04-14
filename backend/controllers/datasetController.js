const path = require('path');
const fs = require('fs');
const Dataset = require('../models/Dataset');
const { processDataset } = require('../utils/dataProcessor');

exports.uploadDataset = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const fileType = path.extname(req.file.originalname).replace('.', '').toLowerCase();
    const dataset = new Dataset({
      user: req.user._id,
      name: req.body.name || req.file.originalname.replace(/\.[^.]+$/, ''),
      originalName: req.file.originalname,
      fileType,
      filePath: req.file.path,
      size: req.file.size,
      status: 'processing'
    });
    await dataset.save();

    // Process async
    processDataset(req.file.path, fileType).then(async ({ columns, stats, previewData, rowCount, columnCount }) => {
      dataset.columns = columns;
      dataset.stats = stats;
      dataset.previewData = previewData;
      dataset.rowCount = rowCount;
      dataset.columnCount = columnCount;
      dataset.status = 'ready';
      await dataset.save();
    }).catch(async err => {
      dataset.status = 'error';
      await dataset.save();
    });

    res.status(201).json(dataset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDatasets = async (req, res) => {
  try {
    const datasets = await Dataset.find({ user: req.user._id }).sort({ createdAt: -1 }).select('-previewData -stats');
    res.json(datasets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findOne({ _id: req.params.id, user: req.user._id });
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });
    res.json(dataset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDatasetPreview = async (req, res) => {
  try {
    const dataset = await Dataset.findOne({ _id: req.params.id, user: req.user._id });
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });
    res.json({ columns: dataset.columns, previewData: dataset.previewData, stats: dataset.stats });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDataset = async (req, res) => {
  try {
    const dataset = await Dataset.findOne({ _id: req.params.id, user: req.user._id });
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });

    if (dataset.filePath && fs.existsSync(dataset.filePath)) fs.unlinkSync(dataset.filePath);
    await dataset.deleteOne();
    res.json({ message: 'Dataset deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
