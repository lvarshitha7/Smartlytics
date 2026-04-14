import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { KpiCard, Badge } from '../components/ui/UIComponents';
import Button from '../components/ui/Button';
import { renderChart } from '../components/charts/ChartComponents';
import { demoDashboard, demoQuestions, demoWidgetData } from '../data/demoDashboard';
import styles from './PublicDemoPage.module.css';

const COLORS = ['green', 'blue', 'purple', 'orange', 'red', 'teal'];

const fmtNum = (n) => {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return '—';
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return parseFloat(Number(n).toFixed(2)).toLocaleString();
};

export default function PublicDemoPage() {
  const [phase, setPhase] = useState(0);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(demoQuestions[0].question);
  const [answer, setAnswer] = useState('');
  const [asking, setAsking] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 450),
      setTimeout(() => setPhase(2), 1100),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setLoading(false), 2300)
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleAsk = () => {
    setAsking(true);
    setAnswer('');
    setTimeout(() => {
      const matched = demoQuestions.find((item) => item.question === question) || demoQuestions[0];
      setAnswer(matched.answer);
      setAsking(false);
    }, 900);
  };

  const widgets = useMemo(() => demoDashboard.widgets, []);
  const kpiWidgets = widgets.filter((w) => w.type === 'kpi');
  const chartWidgets = widgets.filter((w) => w.type !== 'kpi');

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Link to="/home" className={styles.brand}>
          <span className={styles.brandBox}>S</span>
          <span>Smartlytics</span>
        </Link>
        <div className={styles.topbarActions}>
          <Badge color="green" size="sm">Live Demo</Badge>
          <Link to="/register" className={styles.topbarLink}>Create account</Link>
        </div>
      </header>

      <section className={styles.hero}>
        <div>
          <div className={styles.kicker}>Public Demo</div>
          <h1 className={styles.title}>Try Smartlytics with sample data, no signup required.</h1>
          <p className={styles.subtitle}>
            This demo walks through the same product story recruiters care about: dataset profiling,
            AI-assisted dashboard generation, KPI cards, charts, and plain-English analysis.
          </p>
          <div className={styles.heroActions}>
            <Button onClick={() => window.location.reload()} icon={<RefreshIcon />}>Replay Demo</Button>
            <Link to="/register" className={styles.secondaryAction}>Build your own dashboard</Link>
          </div>
        </div>

        <div className={styles.generatorCard}>
          <div className={styles.generatorHeader}>
            <div>
              <div className={styles.generatorTitle}>AI generation status</div>
              <div className={styles.generatorSub}>Sample dataset: {demoDashboard.dataset.name}</div>
            </div>
            <Badge color={loading ? 'purple' : 'green'} size="sm">{loading ? 'Generating' : 'Ready'}</Badge>
          </div>
          {[
            'Profiling columns and data types',
            'Selecting KPIs and chart types',
            'Building layout and visual hierarchy',
            'Preparing narrative insights'
          ].map((step, index) => (
            <div key={step} className={`${styles.stepRow} ${phase > index ? styles.stepDone : phase === index ? styles.stepActive : ''}`}>
              <span className={styles.stepDot}>{phase > index ? '✓' : index + 1}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </section>

      {loading ? (
        <section className={styles.loadingPanel}>
          <div className="spinner lg" />
          <div className={styles.loadingTitle}>Generating your sample dashboard...</div>
          <div className={styles.loadingText}>Smartlytics is simulating the full AI workflow with preloaded data.</div>
        </section>
      ) : (
        <section className={styles.dashboardShell}>
          <div className={styles.dashboardHeader}>
            <div>
              <div className={styles.dashboardName}>{demoDashboard.name}</div>
              <div className={styles.dashboardMeta}>
                <Badge color="purple" size="sm">AI Generated</Badge>
                <span>{demoDashboard.dataset.name} · {demoDashboard.widgets.length} widgets</span>
              </div>
            </div>
            <div className={styles.dashboardActions}>
              <Button variant="ghost" size="sm" onClick={() => setQuestion(demoQuestions[0].question)}>Reset Question</Button>
              <Button variant="secondary" size="sm" onClick={() => window.location.reload()} icon={<RefreshIcon />}>Regenerate</Button>
            </div>
          </div>

          <div className={styles.sectionLabel}>Key KPIs</div>
          <div className={styles.kpiGrid}>
            {kpiWidgets.map((widget, index) => {
              const datum = demoWidgetData[widget.id];
              return (
                <KpiCard
                  key={widget.id}
                  label={widget.title}
                  value={fmtNum(datum?.value)}
                  subtitle={widget.subtitle}
                  prefix={widget.kpiConfig?.prefix || ''}
                  suffix={widget.kpiConfig?.suffix || ''}
                  color={widget.kpiConfig?.colorTheme || COLORS[index % COLORS.length]}
                />
              );
            })}
          </div>

          <div className={styles.contentGrid}>
            <div>
              <div className={styles.sectionLabel}>Dashboard preview</div>
              <div className={styles.chartsGrid}>
                {chartWidgets.map((widget) => {
                  const data = demoWidgetData[widget.id];
                  const isWide = (widget.w || 6) >= 8;
                  return (
                    <div key={widget.id} className={`${styles.chartCard} ${isWide ? styles.chartWide : ''}`}>
                      <div className={styles.chartHeader}>
                        <div>
                          <div className={styles.chartTitle}>{widget.title}</div>
                          <div className={styles.chartSub}>{widget.subtitle}</div>
                        </div>
                        <span className={styles.chartType}>{widget.type}</span>
                      </div>
                      <div className={styles.chartBody}>{renderChart(widget.type, data, widget.config || {})}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <aside className={styles.sidePanel}>
              <div className={styles.askCard}>
                <div className={styles.askTitle}>Ask the demo dataset</div>
                <div className={styles.askSub}>Try the same natural-language workflow used in the main product.</div>
                <select className={styles.select} value={question} onChange={(e) => setQuestion(e.target.value)}>
                  {demoQuestions.map((item) => (
                    <option key={item.question} value={item.question}>{item.question}</option>
                  ))}
                </select>
                <Button onClick={handleAsk} loading={asking}>Run AI analysis</Button>
                <div className={styles.answerBox}>
                  {asking ? (
                    <div className={styles.answerLoading}><div className="spinner" /> Generating response...</div>
                  ) : answer ? (
                    answer
                  ) : (
                    'Pick a sample question to see how Smartlytics turns data into business insights.'
                  )}
                </div>
              </div>

              <div className={styles.ctaCard}>
                <div className={styles.ctaTitle}>Want the full experience?</div>
                <p className={styles.ctaText}>Upload your own CSV or Excel file, generate dashboards with Gemini AI, and explore your own metrics.</p>
                <Link to="/register" className={styles.ctaLink}>Create a free account</Link>
              </div>
            </aside>
          </div>
        </section>
      )}
    </div>
  );
}

function RefreshIcon() {
  return <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11.5 6.5A5 5 0 112.5 3M2 1v2h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>;
}
