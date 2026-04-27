import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, Scatter } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler);

const PALETTES = {
  blue: ['#1a56db', '#3f83f8', '#76a9fa', '#a4cafe', '#c3ddfd'],
  green: ['#057a55', '#0e9f6e', '#31c48d', '#84e1bc', '#bcf0da'],
  orange: ['#c05621', '#dd6b20', '#ed8936', '#f6ad55', '#fbd38d'],
  purple: ['#6c2bd9', '#7e3af2', '#9061f9', '#ac94fa', '#c4b5fd'],
  red: ['#c81e1e', '#e02424', '#f05252', '#f98080', '#fbd5d5'],
  teal: ['#0694a2', '#0e7490', '#06b6d4', '#67e8f9', '#a5f3fc'],
  multi: ['#1a56db', '#057a55', '#c05621', '#6c2bd9', '#c81e1e', '#0694a2', '#b45309', '#047857']
};

const baseOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: { display: false },
    tooltip: {
      backgroundColor: 'rgba(17,17,16,0.9)',
      titleFont: { size: 12, weight: 'bold', family: "'Plus Jakarta Sans', sans-serif" },
      bodyFont: { size: 12, family: "'Plus Jakarta Sans', sans-serif" },
      padding: 10, cornerRadius: 8
    }
  },
  scales: {
    x: { ticks: { font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" }, maxRotation: 45 }, grid: { color: 'rgba(0,0,0,0.04)' } },
    y: { ticks: { font: { size: 11, family: "'Plus Jakarta Sans', sans-serif" } }, grid: { color: 'rgba(0,0,0,0.05)' } }
  }
});

export function BarChart({ data, config = {} }) {
  if (!data?.labels?.length) return <NoData />;
  const palette = PALETTES[config.colorScheme] || PALETTES.blue;
  const isGrouped = data.datasets?.length > 1;

  const chartData = isGrouped ? {
    labels: data.labels,
    datasets: (data.datasets || []).map((ds, i) => ({
      label: ds.label, data: ds.data,
      backgroundColor: PALETTES.multi[i % PALETTES.multi.length] + 'cc',
      borderColor: PALETTES.multi[i % PALETTES.multi.length],
      borderWidth: 1, borderRadius: 4
    }))
  } : {
    labels: data.labels,
    datasets: [{ label: config.yAxis || 'Value', data: data.values, backgroundColor: palette.map(c => c + 'cc'), borderColor: palette, borderWidth: 1, borderRadius: 4 }]
  };

  return (
    <Bar data={chartData} options={{ ...baseOptions(), plugins: { ...baseOptions().plugins, legend: { display: isGrouped, position: 'top', labels: { font: { size: 11 }, boxWidth: 12 } } } }} />
  );
}

export function LineChart({ data, config = {} }) {
  if (!data?.labels?.length) return <NoData />;
  const palette = PALETTES[config.colorScheme] || PALETTES.blue;
  const isGrouped = data.datasets?.length > 1;
  const color = palette[0];

  const chartData = isGrouped ? {
    labels: data.labels,
    datasets: (data.datasets || []).map((ds, i) => ({
      label: ds.label, data: ds.data,
      borderColor: PALETTES.multi[i % PALETTES.multi.length],
      backgroundColor: PALETTES.multi[i % PALETTES.multi.length] + '18',
      borderWidth: 2, tension: 0.35, fill: false, pointRadius: data.labels.length > 50 ? 0 : 3
    }))
  } : {
    labels: data.labels,
    datasets: [{ label: config.yAxis || 'Value', data: data.values, borderColor: color, backgroundColor: color + '18', borderWidth: 2, tension: 0.35, fill: true, pointRadius: data.labels.length > 50 ? 0 : 3 }]
  };

  return <Line data={chartData} options={{ ...baseOptions(), plugins: { ...baseOptions().plugins, legend: { display: isGrouped, position: 'top', labels: { font: { size: 11 }, boxWidth: 12 } } } }} />;
}

export function AreaChart({ data, config = {} }) {
  if (!data?.labels?.length) return <NoData />;
  const color = (PALETTES[config.colorScheme] || PALETTES.teal)[0];
  const chartData = { labels: data.labels, datasets: [{ data: data.values, borderColor: color, backgroundColor: color + '30', borderWidth: 2, tension: 0.4, fill: true, pointRadius: 0 }] };
  return <Line data={chartData} options={baseOptions()} />;
}

export function PieChart({ data, config = {} }) {
  if (!data?.labels?.length) return <NoData />;
  const chartData = { labels: data.labels, datasets: [{ data: data.values, backgroundColor: PALETTES.multi.slice(0, data.labels.length), borderWidth: 2, borderColor: '#fff' }] };
  return <Pie data={chartData} options={{ ...baseOptions(), plugins: { ...baseOptions().plugins, legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, boxWidth: 12, padding: 10 } } }, scales: undefined }} />;
}

export function DoughnutChart({ data, config = {} }) {
  if (!data?.labels?.length) return <NoData />;
  const chartData = { labels: data.labels, datasets: [{ data: data.values, backgroundColor: PALETTES.multi.slice(0, data.labels.length), borderWidth: 2, borderColor: '#fff', hoverOffset: 6 }] };
  return <Doughnut data={chartData} options={{ ...baseOptions(), cutout: '60%', plugins: { ...baseOptions().plugins, legend: { display: true, position: 'bottom', labels: { font: { size: 11 }, boxWidth: 12, padding: 10 } } }, scales: undefined }} />;
}

export function ScatterChart({ data, config = {} }) {
  if (!data?.values?.length && !data?.labels?.length) return <NoData />;
  const pts = (data.values || []).map((y, i) => ({ x: i, y }));
  const chartData = { datasets: [{ label: 'Data', data: pts, backgroundColor: (PALETTES[config.colorScheme] || PALETTES.orange)[0] + '99', pointRadius: 5, pointHoverRadius: 7 }] };
  return <Scatter data={chartData} options={baseOptions()} />;
}

export function HistogramChart({ data, config = {} }) {
  if (!data?.labels?.length) return <NoData />;
  const color = (PALETTES[config.colorScheme] || PALETTES.blue)[0];
  const chartData = { labels: data.labels, datasets: [{ data: data.values, backgroundColor: color + 'bb', borderColor: color, borderWidth: 1, borderRadius: 2 }] };
  return <Bar data={chartData} options={{ ...baseOptions(), plugins: { ...baseOptions().plugins }, barPercentage: 1, categoryPercentage: 1 }} />;
}

function NoData() {
  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9a9a95', fontSize: 13 }}>No data available</div>;
}

export function renderChart(type, data, config) {
  const props = { data, config };
  switch (type) {
    case 'bar': return <BarChart {...props} />;
    case 'line': return <LineChart {...props} />;
    case 'area': return <AreaChart {...props} />;
    case 'pie': return <PieChart {...props} />;
    case 'doughnut': return <DoughnutChart {...props} />;
    case 'scatter': return <ScatterChart {...props} />;
    case 'histogram': return <HistogramChart {...props} />;
    default: return <BarChart {...props} />;
  }
}
