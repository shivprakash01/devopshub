import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import ProjectModal from './components/ProjectModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { ToastProvider, useToast } from './components/Toast';
import { projectService } from './services/api';

function MainApp() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('projects');
  const [selectedProject, setSelectedProject] = useState(null);

  // Global modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Ref to trigger dashboard refresh from navbar
  const [refreshTrigger, setRefreshTrigger] = useState(null);

  const handleRefresh = async () => {
    if (refreshTrigger) {
      await refreshTrigger();
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      await projectService.createProject(projectData);
      addToast(`Project "${projectData.name}" created successfully!`, 'success');
      setIsCreateModalOpen(false);
      handleRefresh();
    } catch (err) {
      addToast(err.message || 'Failed to create project', 'error');
    }
  };

  const handleEditProject = async (projectData) => {
    try {
      const updated = await projectService.updateProject(projectToEdit._id, projectData);
      addToast(`Project "${projectData.name}" updated successfully!`, 'success');
      setIsEditModalOpen(false);
      if (selectedProject && selectedProject._id === projectToEdit._id) {
        setSelectedProject(updated.data);
      }
      handleRefresh();
    } catch (err) {
      addToast(err.message || 'Failed to update project', 'error');
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await projectService.deleteProject(id);
      addToast('Project deleted successfully', 'info');
      setIsDeleteModalOpen(false);
      if (selectedProject && selectedProject._id === id) {
        setSelectedProject(null);
      }
      handleRefresh();
    } catch (err) {
      addToast(err.message || 'Failed to delete project', 'error');
    }
  };

  return (
    <div className="app-container">
      {/* Collapsible/Fixed Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar
          onOpenNewProject={() => setIsCreateModalOpen(true)}
          onRefresh={handleRefresh}
        />

        <main>
          {selectedProject ? (
            <ProjectDetail
              project={selectedProject}
              onBack={() => setSelectedProject(null)}
              onEdit={(proj) => {
                setProjectToEdit(proj);
                setIsEditModalOpen(true);
              }}
              onDelete={(proj) => {
                setProjectToDelete(proj);
                setIsDeleteModalOpen(true);
              }}
            />
          ) : (
            <Dashboard
              onViewProject={(proj) => setSelectedProject(proj)}
              onRegisterRefresh={(refreshFn) => setRefreshTrigger(() => refreshFn)}
            />
          )}
        </main>
      </div>

      {/* Global Create Project Modal */}
      <ProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateProject}
        projectToEdit={null}
      />

      {/* Global Edit Project Modal */}
      <ProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditProject}
        projectToEdit={projectToEdit}
      />

      {/* Global Delete Project Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProject}
        project={projectToDelete}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
