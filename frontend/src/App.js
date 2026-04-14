import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/globals.css';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardsPage from './pages/DashboardsPage';
import DatasetsPage from './pages/DatasetsPage';
import DashboardViewPage from './pages/DashboardViewPage';
import NewDashboardPage from './pages/NewDashboardPage';
import PublicDemoPage from './pages/PublicDemoPage';
import AppLayout from './components/layout/AppLayout';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <div className="spinner lg" />
    </div>
  );
  return user ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <div className="spinner lg" />
    </div>
  );
  return !user ? children : <Navigate to="/home" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/demo" element={<PublicDemoPage />} />
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/home" element={<PrivateRoute><AppLayout><DashboardsPage /></AppLayout></PrivateRoute>} />
          <Route path="/datasets" element={<PrivateRoute><AppLayout><DatasetsPage /></AppLayout></PrivateRoute>} />
          <Route path="/dashboards/new" element={<PrivateRoute><AppLayout><NewDashboardPage /></AppLayout></PrivateRoute>} />
          <Route path="/dashboards/:id" element={<PrivateRoute><AppLayout><DashboardViewPage /></AppLayout></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar theme="light"
        toastStyle={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13, borderRadius: 10 }} />
    </AuthProvider>
  );
}
