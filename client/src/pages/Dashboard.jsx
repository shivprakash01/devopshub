import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  FolderPlus,
  FolderGit2,
  Rocket,
  AlertOctagon,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import StatCard from '../components/StatCard';
import ProjectCard from '../components/ProjectCard';
import ProjectTable from '../components/ProjectTable';
import ProjectModal from '../components/ProjectModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { projectService } from '../services/api';
import { useToast } from '../components/Toast';

export default function Dashboard({ onViewProject, onRegisterRefresh }) {
  const { addToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    testing: 0,
    deployed: 0,
    critical: 0,
    avgProgress: 0,
  });

  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Filters & Search
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('latest');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [projectsRes, statsRes] = await Promise.all([
        projectService.getProjects({
          search,
          status: statusFilter,
          priority: priorityFilter,
          category: categoryFilter,
          sort: sortBy,
        }),
        projectService.getStats(),
      ]);

      if (projectsRes.success) {
        setProjects(projectsRes.data);
      }
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load projects', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [search, statusFilter, priorityFilter, categoryFilter, sortBy]);

  // Allow parent/navbar to trigger refresh
  useEffect(() => {
    if (onRegisterRefresh) {
      onRegisterRefresh(() => fetchDashboardData);
    }
  }, [onRegisterRefresh]);

  // Modal Handlers
  const handleOpenCreateModal = () => {
    setProjectToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleSaveProject = async (projectData) => {
    if (projectToEdit) {
      await projectService.updateProject(projectToEdit._id, projectData);
      addToast(`Project "${projectData.name}" updated successfully!`, 'success');
    } else {
      await projectService.createProject(projectData);
      addToast(`Project "${projectData.name}" created successfully!`, 'success');
    }
    fetchDashboardData();
  };

  const handleConfirmDelete = async (id) => {
    try {
      await projectService.deleteProject(id);
      addToast('Project deleted successfully', 'info');
      setIsDeleteModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      addToast(err.message || 'Failed to delete project', 'error');
    }
  };

  return (
    <div className="page-wrapper">
      {/* Top Banner / Welcome */}
      <div style={{
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.025em' }}>
            Project Management & CI/CD Workspace
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Monitor cloud-native repositories, manage sprints, and orchestrate automated pipelines.
          </p>
        </div>

        <button
          id="btn-create-project-banner"
          onClick={handleOpenCreateModal}
          className="btn btn-primary"
        >
          <FolderPlus size={18} />
          <span>Create New Project</span>
        </button>
      </div>

      {/* Stats Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}>
        <StatCard
          title="Total Projects"
          value={stats.total}
          icon={FolderGit2}
          color="indigo"
          subtitle="All active workspaces"
        />
        <StatCard
          title="In Development"
          value={stats.inProgress}
          icon={Rocket}
          color="cyan"
          subtitle="Sprint active"
        />
        <StatCard
          title="Deployed / Complete"
          value={stats.deployed}
          icon={CheckCircle}
          color="emerald"
          subtitle="Production ready"
        />
        <StatCard
          title="Critical Priority"
          value={stats.critical}
          icon={AlertOctagon}
          color="rose"
          subtitle="Needs attention"
        />
        <StatCard
          title="Avg Progress"
          value={`${stats.avgProgress}%`}
          icon={TrendingUp}
          color="amber"
          subtitle="Across all repos"
        />
      </div>

      {/* Filters, Search & View Controls */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '400px' }}>
            <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              id="input-search-projects"
              className="form-input"
              style={{ paddingLeft: '2.25rem' }}
              placeholder="Search projects, keys, tech stack..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Dropdowns & View Mode */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
            {/* Status Filter */}
            <select
              id="select-filter-status"
              className="form-select"
              style={{ width: 'auto', minWidth: '130px' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Testing">Testing</option>
              <option value="Deployed">Deployed</option>
              <option value="Completed">Completed</option>
            </select>

            {/* Priority Filter */}
            <select
              id="select-filter-priority"
              className="form-select"
              style={{ width: 'auto', minWidth: '130px' }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Sort Dropdown */}
            <select
              id="select-sort-by"
              className="form-select"
              style={{ width: 'auto', minWidth: '140px' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Newest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="progress-desc">Progress (High to Low)</option>
              <option value="progress-asc">Progress (Low to High)</option>
            </select>

            {/* View Mode Toggle Buttons */}
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '3px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}>
              <button
                id="btn-view-grid"
                onClick={() => setViewMode('grid')}
                className="btn-icon"
                style={{
                  padding: '5px 8px',
                  background: viewMode === 'grid' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                  color: viewMode === 'grid' ? '#a5b4fc' : '#94a3b8',
                  border: 'none',
                }}
                title="Grid View"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                id="btn-view-table"
                onClick={() => setViewMode('table')}
                className="btn-icon"
                style={{
                  padding: '5px 8px',
                  background: viewMode === 'table' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                  color: viewMode === 'table' ? '#a5b4fc' : '#94a3b8',
                  border: 'none',
                }}
                title="Table View"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Content Area */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div className="status-dot running" style={{ width: '16px', height: '16px', margin: '0 auto 1rem' }} />
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Loading DevOpsHub workspaces...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FolderGit2 size={48} color="#6366f1" style={{ margin: '0 auto 1rem', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '0.5rem' }}>
            No Projects Found
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            {search || statusFilter !== 'All' || priorityFilter !== 'All'
              ? 'No projects matched your current filters. Try resetting search criteria.'
              : 'Get started by creating your first cloud-native project.'}
          </p>
          <button onClick={handleOpenCreateModal} className="btn btn-primary">
            <FolderPlus size={16} />
            <span>Create New Project</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onEdit={handleOpenEditModal}
              onDelete={handleOpenDeleteModal}
              onView={onViewProject}
            />
          ))}
        </div>
      ) : (
        <ProjectTable
          projects={projects}
          onEdit={handleOpenEditModal}
          onDelete={handleOpenDeleteModal}
          onView={onViewProject}
        />
      )}

      {/* Create / Edit Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        projectToEdit={projectToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        project={projectToDelete}
      />
    </div>
  );
}
