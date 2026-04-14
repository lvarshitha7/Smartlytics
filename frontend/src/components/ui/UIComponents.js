import React from 'react';
import styles from './UIComponents.module.css';

// ---- CARD ----
export function Card({ children, className = '', hover = false, onClick, padding = 'md' }) {
  return (
    <div className={`${styles.card} ${hover ? styles.cardHover : ''} ${styles[`pad_${padding}`]} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
}

// ---- MODAL ----
export function Modal({ open, onClose, title, children, width = 560 }) {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} style={{ maxWidth: width }}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{title}</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className={styles.modalBody}>{children}</div>
      </div>
    </div>
  );
}

// ---- BADGE ----
export function Badge({ children, color = 'default', size = 'md' }) {
  return <span className={`${styles.badge} ${styles[`badge_${color}`]} ${styles[`badge_${size}`]}`}>{children}</span>;
}

// ---- INPUT ----
export function Input({ label, error, icon, ...props }) {
  return (
    <div className={styles.inputWrap}>
      {label && <label className={styles.inputLabel}>{label}</label>}
      <div className={styles.inputInner}>
        {icon && <span className={styles.inputIcon}>{icon}</span>}
        <input className={`${styles.input} ${icon ? styles.inputWithIcon : ''} ${error ? styles.inputError : ''}`} {...props} />
      </div>
      {error && <span className={styles.inputErrMsg}>{error}</span>}
    </div>
  );
}

// ---- SELECT ----
export function Select({ label, error, children, ...props }) {
  return (
    <div className={styles.inputWrap}>
      {label && <label className={styles.inputLabel}>{label}</label>}
      <select className={`${styles.input} ${styles.select} ${error ? styles.inputError : ''}`} {...props}>
        {children}
      </select>
      {error && <span className={styles.inputErrMsg}>{error}</span>}
    </div>
  );
}

// ---- PAGE HEADER ----
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className={styles.pageHeader}>
      <div>
        <h1 className={styles.pageTitle}>{title}</h1>
        {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
      </div>
      {actions && <div className={styles.pageActions}>{actions}</div>}
    </div>
  );
}

// ---- EMPTY STATE ----
export function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div className={styles.emptyState}>
      {icon && <div className={styles.emptyIcon}>{icon}</div>}
      <div className={styles.emptyTitle}>{title}</div>
      {subtitle && <div className={styles.emptySub}>{subtitle}</div>}
      {action && <div className={styles.emptyAction}>{action}</div>}
    </div>
  );
}

// ---- STAT KPI CARD ----
export function KpiCard({ label, value, subtitle, delta, deltaType = 'up', prefix = '', suffix = '', color = 'blue' }) {
  return (
    <div className={`${styles.kpiCard} ${styles[`kpi_${color}`]}`}>
      <div className={styles.kpiLabel}>{label}</div>
      <div className={styles.kpiValue}>{prefix}{value}{suffix}</div>
      {subtitle && <div className={styles.kpiSub}>{subtitle}</div>}
      {delta !== undefined && (
        <div className={`${styles.kpiDelta} ${styles[`delta_${deltaType}`]}`}>
          {deltaType === 'up' ? '↑' : '↓'} {delta}
        </div>
      )}
    </div>
  );
}
