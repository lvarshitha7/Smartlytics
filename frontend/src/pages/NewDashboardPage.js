import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { datasetAPI, aiAPI } from '../services/api';
import { PageHeader } from '../components/ui/UIComponents';
import Button from '../components/ui/Button';
import styles from './NewDashboardPage.module.css';

export default function NewDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(location.state?.datasetId || '');
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [kpiInputs, setKpiInputs] = useState(['']);
  const [generating, setGenerating] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [step, setStep] = useState(1); // 1=choose dataset, 2=configure, 3=generating

  useEffect(() => {
    datasetAPI.list().then(r => {
      const ready = r.data.filter(d => d.status === 'ready');
      setDatasets(ready);
    });
  }, []);

  useEffect(() => {
    if (selectedDataset) {
      datasetAPI.get(selectedDataset).then(r => setDatasetInfo(r.data));
    }
  }, [selectedDataset]);

  const fetchSuggestions = async () => {
    if (!selectedDataset) return;
    setLoadingSuggestions(true);
    try {
      const { data } = await aiAPI.suggestions(selectedDataset);
      setSuggestions(data);
      setStep(2);
    } catch { toast.error('Could not fetch suggestions'); setStep(2); }
    finally { setLoadingSuggestions(false); }
  };

  const addKpi = () => setKpiInputs(p => [...p, '']);
  const updateKpi = (i, v) => setKpiInputs(p => p.map((k, idx) => idx === i ? v : k));
  const removeKpi = (i) => setKpiInputs(p => p.filter((_, idx) => idx !== i));

  const generate = async () => {
    if (!selectedDataset) return toast.error('Please select a dataset');
    setGenerating(true);
    setStep(3);
    try {
      const kpis = kpiInputs.filter(k => k.trim());
      const fullPrompt = selectedSuggestion
        ? `Create a ${selectedSuggestion.name} dashboard. ${selectedSuggestion.description}. ${prompt}`
        : prompt;
      const { data } = await aiAPI.generate({ datasetId: selectedDataset, prompt: fullPrompt, kpis });
      toast.success('Dashboard generated!');
      navigate(`/dashboards/${data.dashboard._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
      setStep(2);
    } finally { setGenerating(false); }
  };

  const numCols = datasetInfo?.columns?.filter(c => c.type === 'numeric').map(c => c.name) || [];
  const catCols = datasetInfo?.columns?.filter(c => c.type === 'categorical').map(c => c.name) || [];

  return (
    <div>
      <PageHeader title="New Dashboard" subtitle="Choose a dataset and let AI build your dashboard" />

      {/* Step 1: Dataset Selection */}
      <div className={styles.stepCard}>
        <div className={styles.stepHeader}>
          <div className={`${styles.stepNum} ${step >= 1 ? styles.stepActive : ''}`}>1</div>
          <div className={styles.stepTitle}>Select Dataset</div>
        </div>
        <div className={styles.stepBody}>
          {datasets.length === 0 ? (
            <div className={styles.noDatasets}>
              <p>No ready datasets found. <Link to="/datasets" className={styles.link}>Upload a dataset first →</Link></p>
            </div>
          ) : (
            <div className={styles.datasetGrid}>
              {datasets.map(d => (
                <div key={d._id}
                  className={`${styles.datasetCard} ${selectedDataset === d._id ? styles.selectedCard : ''}`}
                  onClick={() => setSelectedDataset(d._id)}>
                  <div className={styles.dsCardIcon}>📋</div>
                  <div className={styles.dsCardName}>{d.name}</div>
                  <div className={styles.dsCardMeta}>{d.rowCount?.toLocaleString()} rows · {d.columnCount} cols</div>
                </div>
              ))}
            </div>
          )}
          {selectedDataset && datasetInfo && (
            <div className={styles.datasetPreview}>
              <div className={styles.previewTitle}>Dataset preview</div>
              <div className={styles.previewTags}>
                {numCols.slice(0,6).map(c => <span key={c} className={styles.numTag}>{c}</span>)}
                {catCols.slice(0,6).map(c => <span key={c} className={styles.catTag}>{c}</span>)}
              </div>
            </div>
          )}
          <div className={styles.stepActions}>
            <Button onClick={fetchSuggestions} loading={loadingSuggestions} disabled={!selectedDataset} icon={<SparkIcon />}>
              Continue
            </Button>
          </div>
        </div>
      </div>

      {/* Step 2: Configure */}
      {step >= 2 && (
        <div className={styles.stepCard}>
          <div className={styles.stepHeader}>
            <div className={`${styles.stepNum} ${styles.stepActive}`}>2</div>
            <div className={styles.stepTitle}>Configure Dashboard</div>
          </div>
          <div className={styles.stepBody}>

            {/* AI Suggestions */}
            {suggestions.length > 0 && (
              <div className={styles.suggestionsSection}>
                <div className={styles.sectionLabel}>✨ AI Suggestions — choose a dashboard type</div>
                <div className={styles.suggestionsGrid}>
                  {suggestions.map((s, i) => (
                    <div key={i}
                      className={`${styles.suggestionCard} ${selectedSuggestion === s ? styles.suggestionSelected : ''}`}
                      onClick={() => setSelectedSuggestion(selectedSuggestion === s ? null : s)}>
                      <div className={styles.sugName}>{s.name}</div>
                      <div className={styles.sugDesc}>{s.description}</div>
                      <div className={styles.sugCharts}>
                        {s.suggestedCharts?.slice(0,3).map((c, ci) => <span key={ci} className={styles.chartChip}>{c}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KPI Inputs */}
            <div className={styles.kpiSection}>
              <div className={styles.sectionLabel}>🎯 KPIs to track (optional)</div>
              <div className={styles.kpiInputs}>
                {kpiInputs.map((k, i) => (
                  <div key={i} className={styles.kpiRow}>
                    <input className={styles.kpiInput} value={k} onChange={e => updateKpi(i, e.target.value)}
                      placeholder={`e.g. Total Sales, Revenue Growth, Avg Order Value`} />
                    {kpiInputs.length > 1 && (
                      <button className={styles.removeKpi} onClick={() => removeKpi(i)}>✕</button>
                    )}
                  </div>
                ))}
                <button className={styles.addKpiBtn} onClick={addKpi}>+ Add KPI</button>
              </div>
            </div>

            {/* Custom Prompt */}
            <div className={styles.promptSection}>
              <div className={styles.sectionLabel}>💬 Additional instructions (optional)</div>
              <textarea className={styles.promptArea} rows={3} value={prompt} onChange={e => setPrompt(e.target.value)}
                placeholder="e.g. Focus on regional performance, show month-over-month trends, highlight top customers..." />
            </div>

            <div className={styles.stepActions}>
              <Button variant="ai" size="lg" onClick={generate} loading={generating} icon={<SparkIcon />}>
                {generating ? 'AI is building your dashboard…' : '✨ Generate Dashboard with AI'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Generating */}
      {step === 3 && generating && (
        <div className={styles.generatingCard}>
          <div className={styles.genSpinner} />
          <div className={styles.genTitle}>AI is analyzing your data…</div>
          <div className={styles.genSub}>Generating charts, KPIs, and insights. This takes a few seconds.</div>
          <div className={styles.genSteps}>
            {['Analyzing column types', 'Computing statistics', 'Designing layout', 'Generating widgets'].map((s, i) => (
              <div key={i} className={styles.genStep} style={{ animationDelay: `${i * 0.5}s` }}>
                <span className={styles.genDot} />
                {s}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SparkIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.5 4.5L13 7l-4.5 1.5L7 13l-1.5-4.5L1 7l4.5-1.5L7 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/></svg>; }
