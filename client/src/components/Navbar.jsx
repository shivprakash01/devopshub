import React, { useState, useEffect } from 'react';
import { Layers, Activity, Plus, RefreshCw } from 'lucide-react';
import { projectService } from '../services/api';

export default function Navbar({ onOpenNewProject, onRefresh }) {
  const [healthStatus, setHealthStatus] = useState('checking');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const checkHealth = async () => {
    try {
      const res = await projectService.getHealth();
      if (res.status === 'healthy') {
        setHealthStatus('healthy');
      } else {
        setHealthStatus('degraded');
      }
    } catch {
      setHealthStatus('disconnected');
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh?.();
    await checkHealth();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.875rem 2rem',
      background: 'rgba(15, 20, 34, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
        }}>
          <Layers size={22} color="#fff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              DevOpsHub
            </span>
            <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '0.125rem 0.4rem', borderRadius: '4px', background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
              v1.0
            </span>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Cloud Project Management & CI/CD Platform</p>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* System Health Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.375rem 0.75rem',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          fontSize: '0.75rem',
          color: '#cbd5e1'
        }} title={`API Status: ${healthStatus}`}>
          <span className={`status-dot ${healthStatus === 'healthy' ? 'healthy' : 'failed'}`} />
          <span>API: {healthStatus === 'healthy' ? 'Online' : 'Offline'}</span>
        </div>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="btn-icon"
          title="Refresh Data"
          disabled={isRefreshing}
        >
          <RefreshCw size={16} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
        </button>

        {/* Create Project CTA */}
        <button
          id="btn-create-project-nav"
          onClick={onOpenNewProject}
          className="btn btn-primary"
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </header>
  );
}
