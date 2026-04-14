import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { dashboardAPI, aiAPI } from '../services/api';
import { KpiCard, Badge, Modal } from '../components/ui/UIComponents';
import Button from '../components/ui/Button';
import { renderChart } from '../components/charts/ChartComponents';
import styles from './DashboardViewPage.module.css';

const COLORS = ['blue','green','orange','purple','red','teal','brand'];
const fmtNum = (n) => {
  if (n === null || n === undefined || isNaN(n)) return '—';
  if (Math.abs(n) >= 1e9) return (n/1e9).toFixed(2) + 'B';
  if (Math.abs(n) >= 1e6) return (n/1e6).toFixed(2) + 'M';
  if (Math.abs(n) >= 1e3) return (n/1e3).toFixed(1) + 'K';
  return parseFloat(n.toFixed(2)).toLocaleString();
};

export default function DashboardViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [widgetData, setWidgetData] = useState({});
  const [loading, setLoading] = useState(true);
  const [computing, setComputing] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await dashboardAPI.get(id);
        setDashboard(data);
        computeData(data);
      } catch { toast.error('Dashboard not found'); navigate('/home'); }
      finally { setLoading(false); }
    })();
  }, [id, navigate]);

  const computeData = async (dash) => {
    setComputing(true);
    try {
      const { data } = await dashboardAPI.compute(dash._id);
      setWidgetData(data);
    } catch (err) {
      toast.error('Could not compute chart data');
    } finally { setComputing(false); }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;
    setAsking(true); setAnswer('');
    try {
      const { data } = await aiAPI.ask(dashboard.dataset._id, question);
      setAnswer(data.answer);
    } catch { setAnswer('Sorry, I could not answer that question.'); }
    finally { setAsking(false); }
  };

  if (loading) return <div className={styles.loadingWrap}><div className="spinner lg" /></div>;
  if (!dashboard) return null;

  const kpiWidgets = dashboard.widgets?.filter(w => w.type === 'kpi') || [];
  const chartWidgets = dashboard.widgets?.filter(w => w.type !== 'kpi') || [];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.backBtn} onClick={() => navigate('/home')}>← Back</button>
          <div>
            <div className={styles.dashName}>{dashboard.name}</div>
            <div className={styles.dashMeta}>
              {dashboard.aiGenerated && <Badge color="purple" size="sm">✨ AI Generated</Badge>}
              <span className={styles.metaText}>{dashboard.dataset?.name} · {dashboard.widgets?.length} widgets</span>
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Button variant="ghost" size="sm" onClick={() => setAskOpen(true)} icon={<AskIcon />}>Ask AI</Button>
          <Button variant="secondary" size="sm" onClick={() => computeData(dashboard)} loading={computing} icon={<RefreshIcon />}>Refresh</Button>
        </div>
      </div>

      {computing && (
        <div className={styles.computingBanner}>
          <div className="spinner" style={{width:14,height:14}} /> Computing chart data…
        </div>
      )}

      {/* KPI Row */}
      {kpiWidgets.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Key Performance Indicators</div>
          <div className={styles.kpiGrid}>
            {kpiWidgets.map((w, i) => {
              const d = widgetData[w.id];
              const val = d?.value;
              return (
                <KpiCard
                  key={w.id}
                  label={w.title}
                  value={fmtNum(val)}
                  subtitle={w.subtitle || `${w.kpiConfig?.aggregation || 'sum'} · ${d?.count || 0} records`}
                  prefix={w.kpiConfig?.prefix || ''}
                  suffix={w.kpiConfig?.suffix || ''}
                  color={w.kpiConfig?.colorTheme || COLORS[i % COLORS.length]}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Charts */}
      {chartWidgets.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionLabel}>Charts & Visualizations</div>
          <div className={styles.chartsGrid}>
            {chartWidgets.map((w) => {
              const data = widgetData[w.id];
              const isWide = ['line','area'].includes(w.type) || (w.w || 6) >= 8;
              return (
                <div key={w.id} className={`${styles.chartCard} ${isWide ? styles.chartWide : ''}`}>
                  <div className={styles.chartCardHeader}>
                    <div>
                      <div className={styles.chartTitle}>{w.title}</div>
                      {w.subtitle && <div className={styles.chartSub}>{w.subtitle}</div>}
                    </div>
                    <span className={styles.chartTypeBadge}>{w.type}</span>
                  </div>
                  <div className={styles.chartBody}>
                    {computing ? (
                      <div className={styles.chartLoading}><div className="spinner" /></div>
                    ) : (
                      renderChart(w.type, data, w.config || {})
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ask AI Modal */}
      <Modal open={askOpen} onClose={() => { setAskOpen(false); setAnswer(''); setQuestion(''); }} title="Ask AI about your data" width={540}>
        <div className={styles.askBody}>
          <p className={styles.askHint}>Ask any question about your dataset in plain English.</p>
          <div className={styles.askInput}>
            <input
              className={styles.askField}
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && askQuestion()}
              placeholder="e.g. What is the highest selling product category?"
              autoFocus
            />
            <Button onClick={askQuestion} loading={asking} icon={<SendIcon />}>Ask</Button>
          </div>
          {asking && <div className={styles.askLoading}><div className="spinner" /> Analyzing your data…</div>}
          {answer && (
            <div className={styles.answerBox}>
              <div className={styles.answerLabel}>AI Answer</div>
              <div className={styles.answerText}>{answer}</div>
            </div>
          )}
          <div className={styles.sampleQs}>
            <div className={styles.sampleLabel}>Try asking:</div>
            {[
              'What is the total sum?',
              'Which category has the highest value?',
              'What is the average across all records?',
              'Are there any outliers in the data?'
            ].map(q => (
              <button key={q} className={styles.sampleQ} onClick={() => { setQuestion(q); }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

function AskIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.4"/><path d="M7 5a1.5 1.5 0 011 2.5C7.5 8 7 8.5 7 9M7 11v.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>; }
function RefreshIcon() { return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11.5 6.5A5 5 0 112.5 3M2 1v2h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>; }
function SendIcon() { return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11.5 1.5L6 7M11.5 1.5L7.5 12 6 7M11.5 1.5L1 5l5 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
