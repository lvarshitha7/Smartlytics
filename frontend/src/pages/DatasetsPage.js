import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { datasetAPI } from '../services/api';
import { PageHeader, EmptyState, Badge } from '../components/ui/UIComponents';
import Button from '../components/ui/Button';
import styles from './DatasetsPage.module.css';

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const load = () => datasetAPI.list().then(r => setDatasets(r.data)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const upload = async (file) => {
    setUploading(true); setUploadProgress(0);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('name', file.name.replace(/\.[^.]+$/, ''));
    try {
      const { data } = await datasetAPI.upload(fd, setUploadProgress);
      toast.success(`"${data.name}" uploaded! Processing...`);
      setDatasets(p => [data, ...p]);
      // Poll for ready status
      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        try {
          const { data: updated } = await datasetAPI.get(data._id);
          if (updated.status === 'ready') {
            clearInterval(poll);
            setDatasets(p => p.map(d => d._id === updated._id ? updated : d));
            toast.success(`"${updated.name}" is ready!`);
          } else if (updated.status === 'error' || attempts > 20) {
            clearInterval(poll);
            if (updated.status === 'error') toast.error('Processing failed');
          }
        } catch { clearInterval(poll); }
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally { setUploading(false); setUploadProgress(0); }
  };

  const onDrop = useCallback((accepted) => { if (accepted[0]) upload(accepted[0]); }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'text/csv': ['.csv'], 'application/vnd.ms-excel': ['.xls'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
    maxFiles: 1
  });

  const deleteDataset = async (id) => {
    if (!window.confirm('Delete this dataset? All related dashboards will be affected.')) return;
    try { await datasetAPI.delete(id); setDatasets(p => p.filter(d => d._id !== id)); toast.success('Deleted'); }
    catch { toast.error('Delete failed'); }
  };

  const fmtSize = (bytes) => {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div>
      <PageHeader title="Datasets" subtitle="Upload and manage your data files"
        actions={<span className={styles.formatHint}>.csv · .xlsx · .xls supported</span>} />

      {/* Upload Zone */}
      <div {...getRootProps()} className={`${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ''} ${uploading ? styles.dropzoneUploading : ''}`}>
        <input {...getInputProps()} />
        {uploading ? (
          <div className={styles.uploadingState}>
            <div className="spinner lg" />
            <div className={styles.uploadLabel}>Uploading… {uploadProgress}%</div>
            <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${uploadProgress}%` }} /></div>
          </div>
        ) : (
          <div className={styles.dropContent}>
            <div className={styles.dropIcon}>📁</div>
            <div className={styles.dropTitle}>{isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}</div>
            <div className={styles.dropSub}>or click to browse — CSV, Excel (.xlsx, .xls) up to 50MB</div>
            <div className={styles.fmtTags}>
              <span className={styles.fmtTag}>.csv</span>
              <span className={styles.fmtTag}>.xlsx</span>
              <span className={styles.fmtTag}>.xls</span>
            </div>
          </div>
        )}
      </div>

      {/* Dataset List */}
      {loading ? (
        <div className={styles.loadingWrap}><div className="spinner lg" /></div>
      ) : datasets.length === 0 ? (
        <EmptyState icon="🗄️" title="No datasets yet" subtitle="Upload a CSV or Excel file to get started." />
      ) : (
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th><th>Rows</th><th>Columns</th><th>Size</th><th>Status</th><th>Uploaded</th><th></th>
              </tr>
            </thead>
            <tbody>
              {datasets.map(d => (
                <tr key={d._id}>
                  <td>
                    <div className={styles.dsName}>{d.name}</div>
                    <div className={styles.dsOrig}>{d.originalName}</div>
                  </td>
                  <td className={styles.mono}>{d.rowCount?.toLocaleString() || '—'}</td>
                  <td className={styles.mono}>{d.columnCount || '—'}</td>
                  <td className={styles.mono}>{fmtSize(d.size)}</td>
                  <td>
                    <Badge color={d.status === 'ready' ? 'green' : d.status === 'error' ? 'red' : 'orange'} size="sm">
                      {d.status === 'processing' ? '⏳ Processing' : d.status === 'ready' ? '✓ Ready' : '✗ Error'}
                    </Badge>
                  </td>
                  <td className={styles.date}>{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.rowActions}>
                      {d.status === 'ready' && (
                        <Button size="sm" variant="secondary" onClick={() => navigate('/dashboards/new', { state: { datasetId: d._id } })}>
                          Create Dashboard
                        </Button>
                      )}
                      <button className={styles.deleteBtn} onClick={() => deleteDataset(d._id)}>
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function TrashIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5.5 3.5V2.5h3v1M5 3.5l.5 8M9 3.5l-.5 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>; }
