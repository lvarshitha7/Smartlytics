export const demoDashboard = {
  name: 'Revenue Performance Demo',
  description: 'A sample AI-generated dashboard built from preloaded ecommerce data.',
  dataset: { _id: 'demo-dataset', name: 'Sample Ecommerce Data', rowCount: 12480 },
  widgets: [
    { id: 'k1', type: 'kpi', title: 'Total Revenue', subtitle: 'sum · 12,480 records', kpiConfig: { prefix: '$', colorTheme: 'green' } },
    { id: 'k2', type: 'kpi', title: 'Orders', subtitle: 'count · all transactions', kpiConfig: { colorTheme: 'blue' } },
    { id: 'k3', type: 'kpi', title: 'Avg Order Value', subtitle: 'avg · per order', kpiConfig: { prefix: '$', colorTheme: 'purple' } },
    { id: 'k4', type: 'kpi', title: 'Return Rate', subtitle: 'avg · all orders', kpiConfig: { suffix: '%', colorTheme: 'orange' } },
    { id: 'c1', type: 'line', title: 'Monthly Revenue Trend', subtitle: '12 month trend', config: { colorScheme: 'blue' }, w: 8 },
    { id: 'c2', type: 'bar', title: 'Revenue by Region', subtitle: 'Top performing markets', config: { colorScheme: 'green' }, w: 4 },
    { id: 'c3', type: 'doughnut', title: 'Channel Mix', subtitle: 'Revenue share by channel', config: { colorScheme: 'purple' }, w: 4 },
    { id: 'c4', type: 'bar', title: 'Top Product Categories', subtitle: 'Sales by category', config: { colorScheme: 'orange' }, w: 8 }
  ]
};

export const demoWidgetData = {
  k1: { value: 4823500, count: 12480 },
  k2: { value: 12480, count: 12480 },
  k3: { value: 386.5, count: 12480 },
  k4: { value: 4.8, count: 12480 },
  c1: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    values: [280000, 310000, 345000, 362000, 389000, 405000, 421000, 438000, 452000, 470000, 498000, 553500]
  },
  c2: {
    labels: ['North America', 'Europe', 'Asia', 'LATAM', 'MEA'],
    values: [1920000, 1240000, 980000, 420000, 263500]
  },
  c3: {
    labels: ['Paid Ads', 'Organic', 'Referral', 'Email'],
    values: [42, 28, 18, 12]
  },
  c4: {
    labels: ['Electronics', 'Fashion', 'Home Decor', 'Beauty', 'Sports'],
    values: [1320000, 1115000, 920000, 780000, 688500]
  }
};

export const demoQuestions = [
  {
    question: 'What is the strongest growth period?',
    answer: 'Revenue accelerates most from September to December, with the largest jump happening between November and December.'
  },
  {
    question: 'Which region contributes the most revenue?',
    answer: 'North America is the highest revenue region, contributing roughly 40% of the total revenue in this sample dataset.'
  },
  {
    question: 'What should I improve next?',
    answer: 'Referral and email channels are under-indexed compared to paid and organic. Expanding lifecycle campaigns would likely lift revenue efficiently.'
  }
];
