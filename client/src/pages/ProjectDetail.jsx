import React, { useState } from 'react';
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
  Loader2,
  CheckCircle,
  Package,
  Server,
  Cloud,
} from 'lucide-react';
import { useToast } from '../components/Toast';
import { projectService } from '../services/api';

export default function ProjectDetail({ project, onBack, onEdit, onDelete, onProjectUpdated }) {
  const { addToast } = useToast();
  const [currentProject, setCurrentProject] = useState(project);
  const [isRunning, setIsRunning] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0); // 0: idle, 1: checkout, 2: test, 3: docker build, 4: push, 5: k8s deploy

  if (!currentProject) return null;

  const handleSimulatePipeline = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setPipelineStep(1);

    addToast(`🚀 CI/CD Pipeline started for ${currentProject.key} (${currentProject.gitHubBranch || 'main'})...`, 'info');

    // Step 1: GitHub Checkout
    await new Promise((r) => setTimeout(r, 900));
    setPipelineStep(2);

    // Step 2: Test Execution
    await new Promise((r) => setTimeout(r, 1000));
    setPipelineStep(3);

    // Step 3: Docker Build
    await new Promise((r) => setTimeout(r, 1200));
    setPipelineStep(4);

    // Step 4: Docker Hub Push
    await new Promise((r) => setTimeout(r, 1100));
    setPipelineStep(5);

    // Step 5: Kubernetes Deploy
    await new Promise((r) => setTimeout(r, 1000));

    const newBuildCount = (currentProject.ciCdConfig?.buildCount || 0) + 1;
    const updatedCiCd = {
      ...currentProject.ciCdConfig,
      buildCount: newBuildCount,
      pipelineStatus: 'Passed',
      lastBuild: new Date().toISOString(),
    };

    try {
      const res = await projectService.updateProject(currentProject._id, {
        ciCdConfig: updatedCiCd,
        status: currentProject.progress === 100 ? 'Deployed' : currentProject.status,
      });
      if (res.data) {
        setCurrentProject(res.data);
        if (onProjectUpdated) onProjectUpdated(res.data);
      }
    } catch (err) {
      console.warn('Could not persist pipeline status to DB:', err.message);
      setCurrentProject((prev) => ({
        ...prev,
        ciCdConfig: updatedCiCd,
      }));
    }

    setIsRunning(false);
    setPipelineStep(0);
    addToast(`🎉 Pipeline #${newBuildCount} for ${currentProject.key} SUCCEEDED! Image published to shivayadav70 and deployed to Kubernetes.`, 'success');
  };

  const stepsList = [
    { label: 'GitHub Checkout', desc: `Pull branch ${currentProject.gitHubBranch || 'main'}` },
    { label: 'Automated Tests', desc: '8 integration tests passing' },
    { label: 'Docker Build', desc: 'Multi-stage image compilation' },
    { label: 'Docker Hub Push', desc: 'Published to shivayadav70' },
    { label: 'Kubernetes Rollout', desc: 'Rolling update to cluster' },
  ];

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
            onClick={() => onEdit(currentProject)}
            className="btn btn-secondary"
          >
            <Edit2 size={15} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(currentProject)}
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
                {currentProject.key}
              </span>
              <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                {currentProject.category}
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em' }}>
              {currentProject.name}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`badge ${currentProject.priority === 'Critical' ? 'badge-priority-critical' : currentProject.priority === 'High' ? 'badge-priority-high' : 'badge-priority-medium'}`}>
              {currentProject.priority} Priority
            </span>
            <span className={`badge ${currentProject.status === 'Deployed' || currentProject.status === 'Completed' ? 'badge-deployed' : 'badge-in-progress'}`}>
              {currentProject.status}
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.9375rem', color: '#cbd5e1', lineHeight: 1.6, maxWidth: '850px', marginBottom: '2rem' }}>
          {currentProject.description || 'No detailed description provided for this project.'}
        </p>

        {/* Progress Bar & Percentage */}
        <div style={{ maxWidth: '600px', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>Sprint & Development Progress</span>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>{currentProject.progress || 0}% Completed</span>
          </div>
          <div className="progress-container" style={{ height: '8px' }}>
            <div
              className={`progress-bar ${currentProject.progress === 100 ? 'success' : ''}`}
              style={{ width: `${currentProject.progress || 0}%` }}
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
            <span className={`status-dot ${isRunning ? 'running' : currentProject.ciCdConfig?.pipelineStatus === 'Passed' ? 'passed' : 'idle'}`} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Connected Repo</span>
              <span className="font-mono" style={{ color: '#cbd5e1' }}>
                {currentProject.gitHubRepo || 'github.com/shivprakash01/devopshub'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Target Branch</span>
              <span className="font-mono" style={{ color: '#22d3ee' }}>
                {currentProject.gitHubBranch || 'main'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Build Status</span>
              <span style={{ fontWeight: 600, color: isRunning ? '#38bdf8' : currentProject.ciCdConfig?.pipelineStatus === 'Passed' ? '#34d399' : '#818cf8' }}>
                {isRunning ? 'Running Pipeline...' : currentProject.ciCdConfig?.pipelineStatus || 'Passed'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Total Builds</span>
              <span style={{ fontWeight: 600, color: '#f8fafc' }}>
                {currentProject.ciCdConfig?.buildCount || 0} builds
              </span>
            </div>
          </div>

          {/* Live Step-by-Step Pipeline Progress Animation */}
          {isRunning && (
            <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader2 size={14} className="spin-animation" />
                <span>Executing Stage {pipelineStep} of 5...</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {stepsList.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isDone = pipelineStep > stepNum;
                  const isCurrent = pipelineStep === stepNum;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                      {isDone ? (
                        <CheckCircle size={14} color="#34d399" />
                      ) : isCurrent ? (
                        <Loader2 size={14} color="#38bdf8" className="spin-animation" />
                      ) : (
                        <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1px solid #475569' }} />
                      )}
                      <span style={{ color: isDone ? '#34d399' : isCurrent ? '#f8fafc' : '#64748b', fontWeight: isCurrent ? 600 : 400 }}>
                        {step.label} — <span style={{ color: '#94a3b8' }}>{step.desc}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={handleSimulatePipeline}
            disabled={isRunning}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem' }}
          >
            {isRunning ? (
              <>
                <Loader2 size={15} className="spin-animation" />
                <span>Running CI/CD Pipeline...</span>
              </>
            ) : (
              <>
                <Play size={15} />
                <span>Trigger CI/CD Pipeline</span>
              </>
            )}
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
              {currentProject.techStack && currentProject.techStack.length > 0 ? (
                currentProject.techStack.map((tech, i) => (
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
              <span style={{ fontWeight: 600 }}>{currentProject.teamLead || 'Shiv Prakash Yadav'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
              <Calendar size={15} color="#94a3b8" />
              <span style={{ color: '#64748b' }}>Created Date:</span>
              <span>{currentProject.createdAt ? new Date(currentProject.createdAt).toLocaleDateString() : 'Recent'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#cbd5e1' }}>
              <Clock size={15} color="#94a3b8" />
              <span style={{ color: '#64748b' }}>Last Updated:</span>
              <span>{currentProject.updatedAt ? new Date(currentProject.updatedAt).toLocaleDateString() : 'Just now'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
