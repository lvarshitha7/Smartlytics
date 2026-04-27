import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { dashboardAPI } from '../services/api';
import { PageHeader, EmptyState, Badge } from '../components/ui/UIComponents';
import Button from '../components/ui/Button';
import styles from './DashboardsPage.module.css';

export default function DashboardsPage() {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    dashboardAPI.list().then(r => setDashboards(r.data)).catch(() => toast.error('Failed to load dashboards')).finally(() => setLoading(false));
  }, []);

  const deleteDash = async (id, e) => {
    e.preventDefault(); e.stopPropagation();
    if (!window.confirm('Delete this dashboard?')) return;
    try {
      await dashboardAPI.delete(id);
      setDashboards(p => p.filter(d => d._id !== id));
      toast.success('Dashboard deleted');
    } catch { toast.error('Delete failed'); }
  };

  const colorMap = { cost: 'orange', sales: 'green', analysis: 'blue', performance: 'purple', default: 'brand' };
  const getColor = (name) => {
    const n = name.toLowerCase();
    for (const [k, v] of Object.entries(colorMap)) { if (n.includes(k)) return v; }
    return 'default';
  };

  if (loading) return (
    <div className={styles.loadingWrap}>
      <div className="spinner lg" />
    </div>
  );

  return (
    <div>
      <PageHeader
        title="My Dashboards"
        subtitle={`${dashboards.length} dashboard${dashboards.length !== 1 ? 's' : ''}`}
        actions={<Button onClick={() => navigate('/dashboards/new')} icon={<PlusIcon />}>New Dashboard</Button>}
      />

      {dashboards.length === 0 ? (
        <EmptyState
          icon="📊"
          title="No dashboards yet"
          subtitle="Upload a dataset and let AI generate your first dashboard in seconds."
          action={<Button onClick={() => navigate('/dashboards/new')} size="lg">Create Your First Dashboard</Button>}
        />
      ) : (
        <div className={styles.grid}>
          {dashboards.map(d => (
            <Link key={d._id} to={`/dashboards/${d._id}`} className={styles.cardLink}>
              <div className={styles.dashCard}>
                <div className={`${styles.cardAccent} ${styles[`accent_${getColor(d.name)}`]}`} />
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>📊</div>
                  <div className={styles.cardMeta}>
                    <div className={styles.cardName}>{d.name}</div>
                    <div className={styles.cardSub}>{d.dataset?.name || 'Dataset'} · {d.dataset?.rowCount?.toLocaleString() || '0'} rows</div>
                  </div>
                </div>
                {d.description && <p className={styles.cardDesc}>{d.description}</p>}
                <div className={styles.cardFooter}>
                  <div className={styles.cardTags}>
                    {d.aiGenerated && <Badge color="purple" size="sm">✨ AI Generated</Badge>}
                    <Badge color="default" size="sm">{d.widgets?.length || 0} widgets</Badge>
                  </div>
                  <div className={styles.cardActions}>
                    <button className={styles.deleteBtn} onClick={e => deleteDash(d._id, e)} title="Delete">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
                <div className={styles.cardDate}>{new Date(d.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </Link>
          ))}

          {/* New dashboard card */}
          <Link to="/dashboards/new" className={styles.newCard}>
            <div className={styles.newCardInner}>
              <div className={styles.newCardIcon}>+</div>
              <div className={styles.newCardText}>Create New Dashboard</div>
              <div className={styles.newCardSub}>Upload data & let AI do the rest</div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

function PlusIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>; }
function TrashIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5.5 3.5V2.5h3v1M5 3.5l.5 8M9 3.5l-.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>; }
