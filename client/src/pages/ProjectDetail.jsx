import React from 'react';
import {
  ArrowLeft,
  GitBranch,
  Calendar,
  User,
  Cpu,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  Edit2,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { useToast } from '../components/Toast';

export default function ProjectDetail({ project, onBack, onEdit, onDelete }) {
  const { addToast } = useToast();

  if (!project) return null;

  const handleSimulatePipeline = () => {
    addToast(`Triggered build pipeline for ${project.key} (${project.gitHubBranch || 'main'}). Jenkins CI/CD integration arriving in Phase 6!`, 'info');
  };

  return (
    <div className="page-wrapper">
      {/* Navigation & Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onBack}
          className="btn btn-secondary"
          style={{ padding: '0.5rem 1rem' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => onEdit(project)}
            className="btn btn-secondary"
          >
            <Edit2 size={15} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(project)}
            className="btn btn-danger"
          >
            <Trash2 size={15} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Main Project Hero Card */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="font-mono" style={{
                fontSize: '0.875rem',
                fontWeight: 700,
                padding: '0.25rem 0.625rem',
                borderRadius: '6px',
                background: 'rgba(99, 102, 241, 0.2)',
                color: '#a5b4fc',
                border: '1px solid rgba(99, 102, 241, 0.4)',
              }}>
                {project.key}
              </span>
              <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                {project.category}
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em' }}>
              {project.name}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`badge ${project.priority === 'Critical' ? 'badge-priority-critical' : project.priority === 'High' ? 'badge-priority-high' : 'badge-priority-medium'}`}>
              {project.priority} Priority
            </span>
            <span className={`badge ${project.status === 'Deployed' || project.status === 'Completed' ? 'badge-deployed' : 'badge-in-progress'}`}>
              {project.status}
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.9375rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '850px', marginBottom: '2rem' }}>
          {project.description || 'No detailed description provided for this project.'}
        </p>

        {/* Progress Bar & Percentage */}
        <div style={{ maxWidth: '600px', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>Sprint & Development Progress</span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{project.progress || 0}% Completed</span>
          </div>
          <div className="progress-container" style={{ height: '8px' }}>
            <div
              className={`progress-bar ${project.progress === 100 ? 'success' : ''}`}
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid of Details & CI/CD Status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* GitHub & CI/CD Pipeline Card */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
                <GitBranch size={18} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>CI/CD Pipeline Status</h3>
            </div>
            <span className={`status-dot ${project.ciCdConfig?.pipelineStatus === 'Passed' ? 'passed' : project.ciCdConfig?.pipelineStatus === 'Running' ? 'running' : 'idle'}`} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Connected Repo</span>
              <span className="font-mono" style={{ color: '#cbd5e1' }}>
                {project.gitHubRepo || 'Not configured'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Target Branch</span>
              <span className="font-mono" style={{ color: '#22d3ee' }}>
                {project.gitHubBranch || 'main'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Build Status</span>
              <span style={{ fontWeight: 600, color: project.ciCdConfig?.pipelineStatus === 'Passed' ? '#34d399' : '#818cf8' }}>
                {project.ciCdConfig?.pipelineStatus || 'Idle'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Total Builds</span>
              <span style={{ fontWeight: 600, color: '#f8fafc' }}>
                {project.ciCdConfig?.buildCount || 0} builds
              </span>
            </div>
          </div>

          <button
            onClick={handleSimulatePipeline}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem' }}
          >
            <Play size={15} />
            <span>Trigger CI/CD Pipeline</span>
          </button>
        </div>

        {/* Project Meta & Tech Stack Card */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '6px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
              <Layers size={18} />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>Technical Specs & Lead</h3>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>Tech Stack & Dependencies</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
              {project.techStack && project.techStack.length > 0 ? (
                project.techStack.map((tech, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      padding: '0.25rem 0.625rem',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#e2e8f0',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {tech}
                  </span>
                ))
              ) : (
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>No stack specified</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
              <User size={15} color="#94a3b8" />
              <span style={{ color: '#64748b' }}>Project Lead:</span>
              <span style={{ fontWeight: 600 }}>{project.teamLead || 'Shiv Prakash Yadav'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
              <Calendar size={15} color="#94a3b8" />
              <span style={{ color: '#64748b' }}>Created Date:</span>
              <span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Recent'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
              <Clock size={15} color="#94a3b8" />
              <span style={{ color: '#64748b' }}>Last Updated:</span>
              <span>{project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'Just now'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
