import React, { useState, useEffect } from 'react';
import { X, Sparkles, FolderPlus, Check } from 'lucide-react';

const CATEGORIES = [
  'Web Application',
  'Cloud Infrastructure',
  'Microservices',
  'Mobile App',
  'Data & AI',
  'DevOps Pipeline',
];

const STATUSES = ['Planning', 'In Progress', 'Testing', 'Deployed', 'On Hold', 'Completed'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];

const POPULAR_STACKS = ['React', 'Node.js', 'Docker', 'Kubernetes', 'AWS', 'MongoDB', 'Express', 'Jenkins', 'Go', 'TypeScript'];

export default function ProjectModal({ isOpen, onClose, onSave, projectToEdit }) {
  const [formData, setFormData] = useState({
    name: '',
    key: '',
    description: '',
    category: 'Web Application',
    status: 'Planning',
    priority: 'Medium',
    gitHubRepo: '',
    gitHubBranch: 'main',
    techStack: 'React, Node.js, Docker',
    progress: 0,
    teamLead: 'Shiv Prakash Yadav',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        name: projectToEdit.name || '',
        key: projectToEdit.key || '',
        description: projectToEdit.description || '',
        category: projectToEdit.category || 'Web Application',
        status: projectToEdit.status || 'Planning',
        priority: projectToEdit.priority || 'Medium',
        gitHubRepo: projectToEdit.gitHubRepo || '',
        gitHubBranch: projectToEdit.gitHubBranch || 'main',
        techStack: Array.isArray(projectToEdit.techStack)
          ? projectToEdit.techStack.join(', ')
          : projectToEdit.techStack || '',
        progress: projectToEdit.progress !== undefined ? projectToEdit.progress : 0,
        teamLead: projectToEdit.teamLead || 'Shiv Prakash Yadav',
      });
    } else {
      setFormData({
        name: '',
        key: '',
        description: '',
        category: 'Web Application',
        status: 'Planning',
        priority: 'Medium',
        gitHubRepo: '',
        gitHubBranch: 'main',
        techStack: 'React, Node.js, Docker',
        progress: 0,
        teamLead: 'Shiv Prakash Yadav',
      });
    }
    setErrors({});
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (formData.progress < 0 || formData.progress > 100) {
      newErrors.progress = 'Progress must be between 0 and 100';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        ...formData,
        progress: Number(formData.progress),
      });
      onClose();
    } catch (err) {
      setErrors({ form: err.message || 'Failed to save project' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStackChip = (tech) => {
    const currentList = formData.techStack
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    let updatedList;
    if (currentList.includes(tech)) {
      updatedList = currentList.filter((t) => t !== tech);
    } else {
      updatedList = [...currentList, tech];
    }
    setFormData({ ...formData, techStack: updatedList.join(', ') });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#818cf8',
            }}>
              <FolderPlus size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc' }}>
                {projectToEdit ? 'Edit Project' : 'Create New Project'}
              </h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {projectToEdit ? `Updating ${projectToEdit.key}` : 'Fill in project details and CI/CD targets'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon" aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {errors.form && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              fontSize: '0.8125rem',
            }}>
              {errors.form}
            </div>
          )}

          {/* Row 1: Name & Key */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label" htmlFor="input-project-name">
                Project Name <span style={{ color: 'var(--accent-rose)' }}>*</span>
              </label>
              <input
                id="input-project-name"
                className="form-input"
                placeholder="e.g. Kubernetes Cluster Auto-Scaler"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              {errors.name && <span style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
            </div>

            <div>
              <label className="form-label" htmlFor="input-project-key">
                Project Key
              </label>
              <input
                id="input-project-key"
                className="form-input font-mono"
                placeholder="e.g. DOP-105"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              />
            </div>
          </div>

          {/* Row 2: Category, Priority, Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label" htmlFor="select-category">Category</label>
              <select
                id="select-category"
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="select-priority">Priority</label>
              <select
                id="select-priority"
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="form-label" htmlFor="select-status">Status</label>
              <select
                id="select-status"
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="form-label" htmlFor="textarea-description">Project Description</label>
            <textarea
              id="textarea-description"
              className="form-textarea"
              rows={3}
              placeholder="Brief description of the project architecture, goals, and deliverables..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Row 3: GitHub Repo & Branch */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label" htmlFor="input-github-repo">GitHub Repository</label>
              <input
                id="input-github-repo"
                className="form-input"
                placeholder="e.g. shivprakash/devopshub"
                value={formData.gitHubRepo}
                onChange={(e) => setFormData({ ...formData, gitHubRepo: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label" htmlFor="input-github-branch">Branch</label>
              <input
                id="input-github-branch"
                className="form-input font-mono"
                placeholder="main"
                value={formData.gitHubBranch}
                onChange={(e) => setFormData({ ...formData, gitHubBranch: e.target.value })}
              />
            </div>
          </div>

          {/* Progress Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
              <label className="form-label" style={{ marginBottom: 0 }}>Progress Completion</label>
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                {formData.progress}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
              style={{ width: '100%', accentColor: 'var(--accent-indigo)', cursor: 'pointer' }}
            />
          </div>

          {/* Tech Stack Chips */}
          <div>
            <label className="form-label">Tech Stack (Click presets or type below)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.5rem' }}>
              {POPULAR_STACKS.map((tech) => {
                const isSelected = formData.techStack
                  .split(',')
                  .map((t) => t.trim().toLowerCase())
                  .includes(tech.toLowerCase());
                return (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => toggleStackChip(tech)}
                    style={{
                      fontSize: '0.6875rem',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      color: isSelected ? '#a5b4fc' : '#94a3b8',
                      border: isSelected ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                    }}
                  >
                    {tech} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
            <input
              className="form-input"
              placeholder="Comma-separated technologies, e.g. React, Node.js, AWS, Docker"
              value={formData.techStack}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
            />
          </div>

          {/* Team Lead */}
          <div>
            <label className="form-label" htmlFor="input-team-lead">Project Lead</label>
            <input
              id="input-team-lead"
              className="form-input"
              placeholder="e.g. Shiv Prakash Yadav"
              value={formData.teamLead}
              onChange={(e) => setFormData({ ...formData, teamLead: e.target.value })}
            />
          </div>

          {/* Modal Footer Actions */}
          <div style={{
            marginTop: '0.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
          }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              id="btn-modal-save"
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : projectToEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
