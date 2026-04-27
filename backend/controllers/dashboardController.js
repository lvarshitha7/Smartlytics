const Dashboard = require('../models/Dashboard');
const Dataset = require('../models/Dataset');
const { processDataset } = require('../utils/dataProcessor');

// Compute widget data from full dataset
async function computeWidgetData(widget, dataset) {
  try {
    const { processDataset } = require('../utils/dataProcessor');
    const allData = await processDataset(dataset.filePath, dataset.fileType);
    const data = allData.data;

    const hasMinPoints = (result, min = 3) => {
      if (!result) return false;
      if (Array.isArray(result.labels) && result.labels.length >= min) return true;
      if (Array.isArray(result.values) && result.values.length >= min) return true;
      if (Array.isArray(result.datasets)) {
        return result.datasets.some(ds => Array.isArray(ds?.data) && ds.data.length >= min);
      }
      return false;
    };

    if (widget.type === 'kpi') {
      const col = widget.kpiConfig?.metric;
      if (!col) return null;
      const vals = data.map(r => parseFloat(r[col])).filter(v => !isNaN(v));
      const agg = widget.kpiConfig?.aggregation || 'sum';
      let value;
      if (agg === 'sum') value = vals.reduce((a, b) => a + b, 0);
      else if (agg === 'avg') value = vals.reduce((a, b) => a + b, 0) / vals.length;
      else if (agg === 'count') value = vals.length;
      else if (agg === 'min') value = Math.min(...vals);
      else if (agg === 'max') value = Math.max(...vals);
      return { value: parseFloat(value?.toFixed(2)), count: vals.length };
    }

    const cfg = widget.config || {};
    if (!cfg.xAxis) return null;

    if (widget.type === 'pie' || widget.type === 'doughnut') {
      const freq = {};
<<<<<<< HEAD
      data.forEach(r => { const k = String(r[cfg.xAxis] || 'Unknown'); freq[k] = (freq[k] || 0) + (cfg.yAxis ? parseFloat(r[cfg.yAxis]) || 0 : 1); });
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
      return { labels: sorted.map(x => x[0]), values: sorted.map(x => parseFloat(x[1].toFixed(2))) };
=======
      data.forEach(r => { const k = String(r[cfg.xAxis] || 'Unknown'); freq[k] = (freq[k]||0) + (cfg.yAxis ? parseFloat(r[cfg.yAxis])||0 : 1); });
      const sorted = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,10);
      const result = { labels: sorted.map(x=>x[0]), values: sorted.map(x=>parseFloat(x[1].toFixed(2))) };
      return hasMinPoints(result) ? result : null;
>>>>>>> eee1ebf529cc484968c5dff0e706a47c132ef4b4
    }

    if (widget.type === 'histogram') {
      const vals = data.map(r => parseFloat(r[cfg.xAxis])).filter(v => !isNaN(v));
      const mn = Math.min(...vals), mx = Math.max(...vals);
      const bins = 20; const step = (mx - mn) / bins || 1;
      const counts = new Array(bins).fill(0);
<<<<<<< HEAD
      vals.forEach(v => { const b = Math.min(Math.floor((v - mn) / step), bins - 1); counts[b]++; });
      const labels = counts.map((_, i) => `${(mn + i * step).toFixed(1)}`);
      return { labels, values: counts };
=======
      vals.forEach(v => { const b = Math.min(Math.floor((v-mn)/step), bins-1); counts[b]++; });
      const labels = counts.map((_, i) => `${(mn+i*step).toFixed(1)}`);
      const result = { labels, values: counts };
      return hasMinPoints(result) ? result : null;
>>>>>>> eee1ebf529cc484968c5dff0e706a47c132ef4b4
    }

    if (cfg.groupBy) {
      const grouped = {};
      const groupKeys = new Set();
      data.forEach(r => {
        const xK = String(r[cfg.xAxis] || '');
        const gK = String(r[cfg.groupBy] || '');
        groupKeys.add(gK);
        if (!grouped[xK]) grouped[xK] = {};
        grouped[xK][gK] = (grouped[xK][gK] || 0) + (parseFloat(r[cfg.yAxis]) || 0);
      });
      const xLabels = Object.keys(grouped).slice(0, 30);
      const groups = [...groupKeys].slice(0, 6);
<<<<<<< HEAD
      const datasets = groups.map(g => ({ label: g, data: xLabels.map(x => parseFloat((grouped[x]?.[g] || 0).toFixed(2))) }));
      return { labels: xLabels, datasets };
=======
      const datasets = groups.map(g => ({ label: g, data: xLabels.map(x => parseFloat((grouped[x]?.[g]||0).toFixed(2))) }));
      const result = { labels: xLabels, datasets };
      return hasMinPoints(result) ? result : null;
>>>>>>> eee1ebf529cc484968c5dff0e706a47c132ef4b4
    }

    const agg = cfg.aggregation || 'sum';
    const grouped = {};
    data.forEach(r => {
      const k = String(r[cfg.xAxis] || '');
      if (!grouped[k]) grouped[k] = [];
      if (cfg.yAxis) grouped[k].push(parseFloat(r[cfg.yAxis]) || 0);
    });
    const sorted = Object.entries(grouped).sort((a, b) => {
      if (agg === 'sum') return b[1].reduce((x, y) => x + y, 0) - a[1].reduce((x, y) => x + y, 0);
      return 0;
    }).slice(0, 30);

    const labels = sorted.map(x => x[0]);
    let values;
    if (agg === 'sum') values = sorted.map(x => parseFloat(x[1].reduce((a, b) => a + b, 0).toFixed(2)));
    else if (agg === 'avg') values = sorted.map(x => parseFloat((x[1].reduce((a, b) => a + b, 0) / x[1].length).toFixed(2)));
    else if (agg === 'count') values = sorted.map(x => x[1].length);
    else if (agg === 'min') values = sorted.map(x => Math.min(...x[1]));
    else if (agg === 'max') values = sorted.map(x => Math.max(...x[1]));

    const result = { labels, values };
    return hasMinPoints(result) ? result : null;
  } catch (err) {
    console.error('Widget compute error:', err);
    return null;
  }
}

exports.createDashboard = async (req, res) => {
  try {
    const { name, description, datasetId, widgets, kpis } = req.body;
    const dataset = await Dataset.findOne({ _id: datasetId, user: req.user._id });
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });

    const dashboard = new Dashboard({ user: req.user._id, dataset: datasetId, name, description, widgets: widgets || [], kpis: kpis || [] });
    await dashboard.save();
    res.status(201).json(dashboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboards = async (req, res) => {
  try {
    const dashboards = await Dashboard.find({ user: req.user._id }).populate('dataset', 'name rowCount columnCount').sort({ updatedAt: -1 });
    res.json(dashboards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne({ _id: req.params.id, user: req.user._id }).populate('dataset');
    if (!dashboard) return res.status(404).json({ message: 'Dashboard not found' });
    dashboard.views += 1;
    await dashboard.save();
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDashboard = async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne({ _id: req.params.id, user: req.user._id });
    if (!dashboard) return res.status(404).json({ message: 'Dashboard not found' });
    Object.assign(dashboard, req.body);
    await dashboard.save();
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDashboard = async (req, res) => {
  try {
    await Dashboard.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.json({ message: 'Dashboard deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.computeWidgets = async (req, res) => {
  try {
    const dashboard = await Dashboard.findOne({ _id: req.params.id, user: req.user._id }).populate('dataset');
    if (!dashboard) return res.status(404).json({ message: 'Dashboard not found' });

    const results = {};
    for (const widget of dashboard.widgets) {
      results[widget.id] = await computeWidgetData(widget, dashboard.dataset);
    }
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
