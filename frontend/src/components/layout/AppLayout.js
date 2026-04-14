import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './AppLayout.module.css';

const NAV = [
  { path: '/home', icon: <GridIcon />, label: 'Dashboards' },
  { path: '/datasets', icon: <DbIcon />, label: 'Datasets' },
  { path: '/dashboards/new', icon: <PlusIcon />, label: 'New Dashboard' },
];

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className={`${styles.layout} ${collapsed ? styles.collapsed : ''}`}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <Link to="/home" className={styles.logo}>
            <span className={styles.logoIcon}>S</span>
            {!collapsed && <span className={styles.logoText}>Smartlytics</span>}
          </Link>
          <button className={styles.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV.map(item => (
            <Link key={item.path} to={item.path}
              className={`${styles.navItem} ${location.pathname === item.path ? styles.active : ''}`}>
              <span className={styles.navIcon}>{item.icon}</span>
              {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>
            {!collapsed && (
              <div className={styles.userInfo}>
                <div className={styles.userName}>{user?.name}</div>
                <div className={styles.userEmail}>{user?.email}</div>
              </div>
            )}
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogoutIcon />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}

function GridIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor"/></svg>; }
function DbIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><ellipse cx="8" cy="4" rx="6" ry="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M2 4v4c0 1.38 2.69 2.5 6 2.5S14 9.38 14 8V4" stroke="currentColor" strokeWidth="1.5"/><path d="M2 8v4c0 1.38 2.69 2.5 6 2.5S14 13.38 14 12V8" stroke="currentColor" strokeWidth="1.5"/></svg>; }
function PlusIcon() { return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>; }
function ChevronLeft() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>; }
function ChevronRight() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>; }
function LogoutIcon() { return <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 7h8M10 4.5L12.5 7 10 9.5M6 2H2a1 1 0 00-1 1v8a1 1 0 001 1h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>; }
