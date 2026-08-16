import React from 'react';
import {
  GitBranch,
  Calendar,
  User,
  Edit2,
  Trash2,
  ExternalLink,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

export default function ProjectCard({ project, onEdit, onDelete, onView }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Planning':
        return <span className="badge badge-planning">Planning</span>;
      case 'In Progress':
        return <span className="badge badge-in-progress">In Progress</span>;
      case 'Testing':
        return <span className="badge badge-testing">Testing</span>;
      case 'Deployed':
        return <span className="badge badge-deployed">Deployed</span>;
      case 'Completed':
        return <span className="badge badge-completed">Completed</span>;
      case 'On Hold':
        return <span className="badge badge-on-hold">On Hold</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return <span className="badge badge-priority-critical">Critical</span>;
      case 'High':
        return <span className="badge badge-priority-high">High</span>;
      case 'Medium':
        return <span className="badge badge-priority-medium">Medium</span>;
      case 'Low':
        return <span className="badge badge-priority-low">Low</span>;
      default:
        return <span className="badge">{priority}</span>;
    }
  };

  return (
    <div className="glass-card glass-card-interactive" style={{
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
    }}>
      <div>
        {/* Card Header: Key + Status + Priority */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="font-mono" style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.5rem',
              borderRadius: '6px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#a5b4fc',
              border: '1px solid rgba(99, 102, 241, 0.25)',
            }}>
              {project.key}
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>
              {project.category}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            {getPriorityBadge(project.priority)}
            {getStatusBadge(project.status)}
          </div>
        </div>

        {/* Project Title */}
        <h3
          onClick={() => onView?.(project)}
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#f8fafc',
            marginBottom: '0.5rem',
            cursor: 'pointer',
            lineHeight: 1.3,
          }}
          title="Click to view details"
        >
          {project.name}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '0.8125rem',
          color: '#94a3b8',
          marginBottom: '1.25rem',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          minHeight: '2.4rem',
        }}>
          {project.description || 'No description provided.'}
        </p>

        {/* Progress Bar */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.375rem' }}>
            <span style={{ color: '#64748b' }}>Progress</span>
            <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{project.progress || 0}%</span>
          </div>
          <div className="progress-container">
            <div
              className={`progress-bar ${project.progress === 100 ? 'success' : ''}`}
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Tech Stack Chips */}
        {project.techStack && project.techStack.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '1.25rem' }}>
            {project.techStack.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  padding: '0.2rem 0.5rem',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span style={{ fontSize: '0.6875rem', color: '#64748b', alignSelf: 'center' }}>
                +{project.techStack.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Metadata & Actions */}
      <div style={{
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Repo & Lead Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: '#64748b' }}>
          {project.gitHubRepo ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#94a3b8' }} title={`Repo: ${project.gitHubRepo}`}>
              <GitBranch size={13} color="#06b6d4" />
              <span style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {project.gitHubRepo.split('/')[1] || project.gitHubRepo}
              </span>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <User size={13} />
              <span>{project.teamLead || 'Unassigned'}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <button
            onClick={() => onView?.(project)}
            className="btn-icon"
            title="View Details"
            aria-label="View Details"
          >
            <ExternalLink size={14} />
          </button>
          <button
            onClick={() => onEdit?.(project)}
            className="btn-icon"
            title="Edit Project"
            aria-label="Edit Project"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete?.(project)}
            className="btn-icon"
            title="Delete Project"
            aria-label="Delete Project"
            style={{ color: 'var(--accent-rose)' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
