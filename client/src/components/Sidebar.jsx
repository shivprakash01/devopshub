import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  GitBranch,
  PlayCircle,
  Cloud,
  Activity,
  Settings,
  FolderGit2,
} from 'lucide-react';

export default function Sidebar({ activeTab, onTabChange }) {
  const menuItems = [
    { id: 'projects', label: 'Projects & Workspaces', icon: LayoutDashboard, phase: 'Live' },
    { id: 'tasks', label: 'Tasks & Boards', icon: CheckSquare, phase: 'v1.0' },
    { id: 'github', label: 'GitHub Integrations', icon: GitBranch, phase: 'Active' },
    { id: 'cicd', label: 'CI/CD Pipelines', icon: PlayCircle, phase: 'Live' },
    { id: 'cloud', label: 'AWS & Kubernetes', icon: Cloud, phase: 'K8s' },
    { id: 'monitoring', label: 'Observability & Logs', icon: Activity, phase: 'Metrics' },
  ];

  return (
    <aside style={{
      width: '260px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.5rem 1rem',
      flexShrink: 0,
    }}>
      <div>
        <div style={{ padding: '0 0.75rem 1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <FolderGit2 size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#f8fafc' }}>B.Tech Final Year</div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Cloud & DevOps Hub</div>
            </div>
          </div>
        </div>

        <nav style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isAvailable = item.id === 'projects';

            return (
              <button
                key={item.id}
                onClick={() => isAvailable && onTabChange?.(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '0.625rem 0.75rem',
                  borderRadius: '8px',
                  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid transparent',
                  color: isActive ? '#818cf8' : isAvailable ? '#cbd5e1' : '#64748b',
                  fontSize: '0.8125rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: isAvailable ? 'pointer' : 'default',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={17} color={isActive ? '#818cf8' : isAvailable ? '#94a3b8' : '#475569'} />
                  <span>{item.label}</span>
                </div>
                {item.phase && (
                  <span style={{
                    fontSize: '0.625rem',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '4px',
                    background: isActive ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#a5b4fc' : '#64748b'
                  }}>
                    {item.phase}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Developer Profile Footer */}
      <div style={{
        padding: '1rem',
        borderRadius: '10px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Active Developer</div>
        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>Shiv Prakash Yadav</div>
        <div style={{ fontSize: '0.6875rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
          Admin & DevOps Lead
        </div>
      </div>
    </aside>
  );
}
