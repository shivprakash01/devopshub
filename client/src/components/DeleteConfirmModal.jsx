import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, project }) {
  if (!isOpen || !project) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '440px' }}
      >
        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            color: 'var(--accent-rose)',
          }}>
            <AlertTriangle size={24} />
          </div>

          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
            Delete Project?
          </h3>

          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.5rem' }}>
            Are you sure you want to delete <strong style={{ color: '#f8fafc' }}>{project.name}</strong> (<span className="font-mono">{project.key}</span>)? This action will remove all project settings and CI/CD targets.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              onClick={onClose}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              id="btn-confirm-delete"
              onClick={() => onConfirm(project._id)}
              className="btn btn-danger"
              style={{ flex: 1 }}
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
