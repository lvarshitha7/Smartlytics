const Papa = require('papaparse');
const XLSX = require('xlsx');
const fs = require('fs');

function detectType(values) {
  const nonEmpty = values.filter(v => v !== null && v !== undefined && v !== '');
  if (!nonEmpty.length) return 'text';
  const numericCount = nonEmpty.filter(v => !isNaN(parseFloat(v)) && isFinite(v)).length;
  if (numericCount / nonEmpty.length > 0.8) return 'numeric';
  const dateCount = nonEmpty.filter(v => !isNaN(Date.parse(String(v))) && String(v).length > 4).length;
  if (dateCount / nonEmpty.length > 0.7) return 'date';
  const uniqueRatio = new Set(nonEmpty.map(String)).size / nonEmpty.length;
  if (uniqueRatio < 0.3) return 'categorical';
  return 'text';
}

function computeStats(data, columns) {
  const stats = {};
  columns.forEach(col => {
    const vals = data.map(r => r[col.name]).filter(v => v !== null && v !== undefined && v !== '');
    if (col.type === 'numeric') {
      const nums = vals.map(v => parseFloat(v)).filter(v => !isNaN(v));
      if (!nums.length) return;
      nums.sort((a, b) => a - b);
      const sum = nums.reduce((a, b) => a + b, 0);
      const mean = sum / nums.length;
      const variance = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / nums.length;
      stats[col.name] = {
        min: nums[0], max: nums[nums.length - 1],
        mean: parseFloat(mean.toFixed(4)),
        median: nums[Math.floor(nums.length / 2)],
        std: parseFloat(Math.sqrt(variance).toFixed(4)),
        sum: parseFloat(sum.toFixed(4)),
        count: nums.length,
        q1: nums[Math.floor(nums.length * 0.25)],
        q3: nums[Math.floor(nums.length * 0.75)]
      };
    } else {
      const freq = {};
      vals.forEach(v => { const k = String(v); freq[k] = (freq[k] || 0) + 1; });
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
      stats[col.name] = {
        uniqueCount: sorted.length,
        topValues: sorted.slice(0, 10).map(([v, c]) => ({ value: v, count: c })),
        mostFrequent: sorted[0]?.[0]
      };
    }
  });
  return stats;
}

async function parseFile(filePath, fileType) {
  if (fileType === 'csv') {
    const content = fs.readFileSync(filePath, 'utf8');
    const result = Papa.parse(content, { header: true, skipEmptyLines: true, dynamicTyping: false });
    return result.data;
  } else {
    const wb = XLSX.readFile(filePath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    return XLSX.utils.sheet_to_json(ws, { defval: '' });
  }
}

async function processDataset(filePath, fileType) {
  const data = await parseFile(filePath, fileType);
  if (!data.length) throw new Error('File is empty or could not be parsed');

  const headers = Object.keys(data[0]);
  const columns = headers.map(name => {
    const vals = data.slice(0, 500).map(r => r[name]);
    const nonEmpty = vals.filter(v => v !== '' && v !== null && v !== undefined);
    return {
      name,
      type: detectType(vals),
      sampleValues: vals.slice(0, 5),
      nullCount: data.filter(r => r[name] === '' || r[name] === null || r[name] === undefined).length,
      uniqueCount: new Set(vals.map(String)).size
    };
  });

  const stats = computeStats(data, columns);
  const previewData = data.slice(0, 100);

  return { data, columns, stats, previewData, rowCount: data.length, columnCount: headers.length };
}

module.exports = { processDataset, detectType, computeStats };
