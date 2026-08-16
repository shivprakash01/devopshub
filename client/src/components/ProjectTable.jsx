import React from 'react';
import { Edit2, Trash2, ExternalLink, GitBranch } from 'lucide-react';

export default function ProjectTable({ projects, onEdit, onDelete, onView }) {
  const getStatusBadge = (status) => {
    const classMap = {
      Planning: 'badge-planning',
      'In Progress': 'badge-in-progress',
      Testing: 'badge-testing',
      Deployed: 'badge-deployed',
      Completed: 'badge-completed',
      'On Hold': 'badge-on-hold',
    };
    return <span className={`badge ${classMap[status] || ''}`}>{status}</span>;
  };

  const getPriorityBadge = (priority) => {
    const classMap = {
      Critical: 'badge-priority-critical',
      High: 'badge-priority-high',
      Medium: 'badge-priority-medium',
      Low: 'badge-priority-low',
    };
    return <span className={`badge ${classMap[priority] || ''}`}>{priority}</span>;
  };

  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div className="glass-card" style={{ overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
              <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Key</th>
              <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Project Name</th>
              <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Category</th>
              <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Priority</th>
              <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, width: '160px' }}>Progress</th>
              <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600 }}>Lead</th>
              <th style={{ padding: '0.875rem 1.25rem', fontWeight: 600, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr
                key={p._id}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Key */}
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span className="font-mono" style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: '#a5b4fc',
                  }}>
                    {p.key}
                  </span>
                </td>

                {/* Name */}
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div
                    onClick={() => onView?.(p)}
                    style={{ fontWeight: 600, color: '#f8fafc', cursor: 'pointer', marginBottom: '2px' }}
                  >
                    {p.name}
                  </div>
                  {p.gitHubRepo && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.6875rem', color: '#64748b' }}>
                      <GitBranch size={11} color="#06b6d4" />
                      <span>{p.gitHubRepo}</span>
                    </div>
                  )}
                </td>

                {/* Category */}
                <td style={{ padding: '1rem 1.25rem', color: '#cbd5e1' }}>
                  {p.category}
                </td>

                {/* Priority */}
                <td style={{ padding: '1rem 1.25rem' }}>
                  {getPriorityBadge(p.priority)}
                </td>

                {/* Status */}
                <td style={{ padding: '1rem 1.25rem' }}>
                  {getStatusBadge(p.status)}
                </td>

                {/* Progress */}
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="progress-container" style={{ flex: 1 }}>
                      <div
                        className={`progress-bar ${p.progress === 100 ? 'success' : ''}`}
                        style={{ width: `${p.progress || 0}%` }}
                      />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', minWidth: '32px' }}>
                      {p.progress || 0}%
                    </span>
                  </div>
                </td>

                {/* Lead */}
                <td style={{ padding: '1rem 1.25rem', color: '#94a3b8' }}>
                  {p.teamLead || 'Unassigned'}
                </td>

                {/* Actions */}
                <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                    <button
                      onClick={() => onView?.(p)}
                      className="btn-icon"
                      title="View Details"
                    >
                      <ExternalLink size={13} />
                    </button>
                    <button
                      onClick={() => onEdit?.(p)}
                      className="btn-icon"
                      title="Edit Project"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => onDelete?.(p)}
                      className="btn-icon"
                      title="Delete Project"
                      style={{ color: 'var(--accent-rose)' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
