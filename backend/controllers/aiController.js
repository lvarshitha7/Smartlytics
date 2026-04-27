const { GoogleGenerativeAI } = require('@google/generative-ai');
const Dataset = require('../models/Dataset');
const Dashboard = require('../models/Dashboard');

const geminiApiKey = process.env.GEMINI_API_KEY;
const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
const MODEL_CANDIDATES = [
  process.env.GEMINI_MODEL,
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
  'gemini-flash-latest',
  'gemini-pro-latest'
].filter(Boolean);

function cleanJsonResponse(text) {
  return String(text || '')
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();
}

const CHART_TYPES = new Set(['line', 'bar', 'pie', 'doughnut', 'scatter', 'area', 'histogram']);
const KPI_TYPES = new Set(['kpi']);
const TYPE_TO_PRIMARY_COLOR = {
  bar: 'blue',
  line: 'green',
  area: 'green',
  pie: 'blue',
  doughnut: 'blue',
  histogram: 'blue',
  scatter: 'green',
  kpi: 'blue'
};

function hasEnoughInlineData(widget) {
  const labelsLen = Array.isArray(widget?.labels) ? widget.labels.length : 0;
  const valuesLen = Array.isArray(widget?.values) ? widget.values.length : 0;
  const datasetsLen = Array.isArray(widget?.datasets) ? widget.datasets.length : 0;
  const firstDatasetPoints = datasetsLen > 0 && Array.isArray(widget.datasets[0]?.data) ? widget.datasets[0].data.length : 0;
  const maxLen = Math.max(labelsLen, valuesLen, firstDatasetPoints);
  if (!labelsLen && !valuesLen && !datasetsLen) return true;
  return maxLen >= 3;
}

function sanitizeGeneratedWidgets(widgets = []) {
  return (widgets || []).filter(Boolean).map((widget, index) => {
    const type = String(widget.type || '').toLowerCase();
    const safeId = widget.id || `w${index + 1}`;
    const normalized = {
      ...widget,
      id: safeId,
      type
    };

    if (KPI_TYPES.has(type)) {
      normalized.kpiConfig = {
        ...(widget.kpiConfig || {}),
        colorTheme: TYPE_TO_PRIMARY_COLOR.kpi
      };
      return normalized;
    }

    if (!CHART_TYPES.has(type)) return null;
    if (!widget?.config?.xAxis) return null;
    if (!hasEnoughInlineData(widget)) return null;

    normalized.config = {
      ...(widget.config || {}),
      colorScheme: TYPE_TO_PRIMARY_COLOR[type] || 'blue'
    };
    return normalized;
  }).filter(Boolean);
}

async function generateWithGemini(prompt, { temperature = 0.4, maxOutputTokens = 4096 } = {}) {
  if (!genAI) {
    throw new Error('GEMINI_API_KEY is missing. Add it to backend/.env and restart the server.');
  }

  let lastError = null;

  for (const modelName of MODEL_CANDIDATES) {
    try {
      const currentModel = genAI.getGenerativeModel({ model: modelName });
      const result = await currentModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: { temperature, maxOutputTokens }
      });
      return cleanJsonResponse(result.response?.text());
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(`Gemini request failed for all configured models (${MODEL_CANDIDATES.join(', ')}): ${lastError?.message || 'Unknown error'}`);
}

exports.listModels = async (_req, res) => {
  try {
    if (!genAI) return res.status(500).json({ message: 'GEMINI_API_KEY is missing' });
    if (process.env.NODE_ENV === 'production') return res.status(403).json({ message: 'Model listing disabled in production' });

    const models = await genAI.listModels();
    const available = [];
    for await (const m of models) {
      available.push({
        name: m.name,
        supportedGenerationMethods: m.supportedGenerationMethods || []
      });
    }

    res.json({
      configuredOrder: MODEL_CANDIDATES,
      availableModels: available
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to list Gemini models' });
  }
};

// Build a schema summary to send to GPT
function buildSchemaSummary(dataset) {
  const numCols = dataset.columns.filter(c => c.type === 'numeric').map(c => c.name);
  const catCols = dataset.columns.filter(c => c.type === 'categorical').map(c => c.name);
  const dateCols = dataset.columns.filter(c => c.type === 'date').map(c => c.name);

  let summary = `Dataset: "${dataset.name}" with ${dataset.rowCount} rows and ${dataset.columnCount} columns.\n`;
  summary += `Numeric columns: ${numCols.join(', ') || 'none'}\n`;
  summary += `Categorical columns: ${catCols.join(', ') || 'none'}\n`;
  summary += `Date columns: ${dateCols.join(', ') || 'none'}\n`;
  summary += `\nColumn stats:\n`;
  dataset.columns.forEach(col => {
    const s = dataset.stats?.[col.name];
    if (col.type === 'numeric' && s) {
      summary += `- ${col.name} (numeric): min=${s.min}, max=${s.max}, avg=${s.mean}, sum=${s.sum}\n`;
    } else if (s?.topValues) {
      summary += `- ${col.name} (categorical): top values = ${s.topValues.slice(0, 5).map(v => `${v.value}(${v.count})`).join(', ')}\n`;
    }
  });
  return summary;
}

exports.generateDashboard = async (req, res) => {
  try {
    const { datasetId, prompt, kpis } = req.body;
    const dataset = await Dataset.findOne({ _id: datasetId, user: req.user._id });
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });
    if (dataset.status !== 'ready') return res.status(400).json({ message: 'Dataset is still processing' });

    const schemaSummary = buildSchemaSummary(dataset);
    const numCols = dataset.columns.filter(c => c.type === 'numeric').map(c => c.name);
    const catCols = dataset.columns.filter(c => c.type === 'categorical').map(c => c.name);
    const dateCols = dataset.columns.filter(c => c.type === 'date').map(c => c.name);

    const userKpiInfo = kpis?.length ? `\nThe user wants these specific KPIs tracked: ${kpis.join(', ')}\n` : '';
    const userPrompt = prompt ? `\nAdditional instructions: ${prompt}` : '';

    const systemPrompt = `You are an expert data analyst and dashboard designer. Given a dataset schema, generate a comprehensive analytics dashboard configuration as JSON.

Return ONLY valid JSON (no markdown, no explanation) with this structure:
{
  "name": "Dashboard Name",
  "description": "Brief description",
  "widgets": [
    {
      "id": "w1",
      "type": "kpi|line|bar|pie|doughnut|scatter|area|histogram",
      "title": "Widget Title",
      "subtitle": "Optional subtitle",
      "x": 0, "y": 0, "w": 3, "h": 2,
      "config": {
        "xAxis": "column_name",
        "yAxis": "column_name",
        "groupBy": "column_name_or_null",
        "aggregation": "sum|avg|count|min|max",
        "colorScheme": "blue|red|yellow",
        "showLegend": true,
        "showDataLabels": false
      },
      "kpiConfig": {
        "metric": "column_name",
        "aggregation": "sum|avg|count|min|max",
        "prefix": "$",
        "suffix": "",
        "colorTheme": "blue|red|yellow"
      }
    }
  ]
}

Rules:
- Generate 5-8 KPI widgets first (type: "kpi") for key numeric metrics
- Generate 6-10 chart widgets of varied types
- Layout: x goes 0-11, y increases for rows. w=3 for KPIs (4 per row), w=6 for charts (2 per row), w=12 for wide charts
- h=2 for KPIs, h=4 for charts
- Use appropriate chart types: pie/doughnut for categorical distribution, bar for comparisons, line/area for time series, histogram for distributions, scatter for correlations
- Only use column names that exist in the dataset
- For KPIs: always set kpiConfig, can leave config as {}
- For charts: always set config with at least xAxis
- Use primary colors only for all widgets: blue, red, or yellow
- Make it insightful and business-relevant`;

    const userMessage = `${schemaSummary}${userKpiInfo}${userPrompt}\n\nGenerate a comprehensive analytics dashboard for this dataset.`;

    const responseText = await generateWithGemini(
      `${systemPrompt}\n\n${userMessage}`,
      { temperature: 0.3, maxOutputTokens: 4096 }
    );

    const dashboardConfig = JSON.parse(responseText);
    const sanitizedWidgets = sanitizeGeneratedWidgets(dashboardConfig.widgets || []);
    if (!sanitizedWidgets.length) {
      return res.status(422).json({ message: 'AI response did not contain valid chart/KPI widgets. Please try again.' });
    }

    // Save as dashboard
    const dashboard = new Dashboard({
      user: req.user._id,
      dataset: datasetId,
      name: dashboardConfig.name || `${dataset.name} Dashboard`,
      description: dashboardConfig.description || '',
      widgets: sanitizedWidgets,
      aiGenerated: true,
      aiPrompt: prompt || ''
    });
    await dashboard.save();

    res.json({ dashboard, config: { ...dashboardConfig, widgets: sanitizedWidgets } });
  } catch (err) {
    console.error('AI generate error:', err);
    res.status(500).json({ message: err.message || 'AI generation failed' });
  }
};

exports.generateSuggestions = async (req, res) => {
  try {
    const { datasetId } = req.body;
    const dataset = await Dataset.findOne({ _id: datasetId, user: req.user._id });
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });

    const schemaSummary = buildSchemaSummary(dataset);

    const text = await generateWithGemini(
      `You are a data analyst. Given a dataset schema, suggest 3 different dashboard types.
Return ONLY JSON array:
[{"name":"Dashboard Name","description":"What insights it provides","focus":"sales|cost|performance|trend|comparison","suggestedCharts":["chart type description"]}]

${schemaSummary}

Suggest 3 dashboard types for this data.`,
      { temperature: 0.5, maxOutputTokens: 1000 }
    );
    const suggestions = JSON.parse(text);
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.askQuestion = async (req, res) => {
  try {
    const { datasetId, question } = req.body;
    const dataset = await Dataset.findOne({ _id: datasetId, user: req.user._id });
    if (!dataset) return res.status(404).json({ message: 'Dataset not found' });

    const schemaSummary = buildSchemaSummary(dataset);

    const answer = await generateWithGemini(
      `You are a data analyst assistant. Answer questions about datasets concisely and accurately based on the schema and statistics provided. Format numbers nicely.

${schemaSummary}

Question: ${question}`,
      { temperature: 0.4, maxOutputTokens: 700 }
    );

    res.json({ answer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
