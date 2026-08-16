import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Response interceptor for consistent error messaging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
    };
    return Promise.reject(customError);
  }
);

// Project API Endpoints
export const projectService = {
  getProjects: async (params = {}) => {
    const res = await api.get('/projects', { params });
    return res.data;
  },

  getStats: async () => {
    const res = await api.get('/projects/stats/summary');
    return res.data;
  },

  getProjectById: async (id) => {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },

  createProject: async (projectData) => {
    const res = await api.post('/projects', projectData);
    return res.data;
  },

  updateProject: async (id, projectData) => {
    const res = await api.put(`/projects/${id}`, projectData);
    return res.data;
  },

  deleteProject: async (id) => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  },

  getHealth: async () => {
    const res = await api.get('/health');
    return res.data;
  },
};

export default api;
