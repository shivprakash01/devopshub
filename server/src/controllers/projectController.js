import mongoose from 'mongoose';
import Project from '../models/Project.js';

// In-memory store fallback if MongoDB is not reachable
let memoryProjects = [
  {
    _id: '64a000000000000000000001',
    name: 'DevOpsHub Cloud Platform',
    key: 'DOP-101',
    description: 'Cloud-native project management and automated CI/CD pipeline dashboard.',
    category: 'Cloud Infrastructure',
    status: 'In Progress',
    priority: 'Critical',
    gitHubRepo: 'shivprakash/devopshub',
    gitHubBranch: 'main',
    techStack: ['React', 'Node.js', 'Docker', 'Kubernetes', 'AWS'],
    progress: 65,
    startDate: new Date('2026-08-01'),
    targetDate: new Date('2026-09-30'),
    teamLead: 'Shiv Prakash Yadav',
    ciCdConfig: {
      pipelineStatus: 'Passed',
      lastBuildTime: new Date(),
      buildCount: 14,
    },
    createdAt: new Date('2026-08-01'),
    updatedAt: new Date(),
  },
  {
    _id: '64a000000000000000000002',
    name: 'Microservices Auth Gateway',
    key: 'DOP-102',
    description: 'OAuth2 & JWT authentication service with rate limiting and RBAC controls.',
    category: 'Microservices',
    status: 'Testing',
    priority: 'High',
    gitHubRepo: 'shivprakash/auth-gateway',
    gitHubBranch: 'develop',
    techStack: ['Node.js', 'Express', 'JWT', 'Redis', 'Docker'],
    progress: 85,
    startDate: new Date('2026-08-05'),
    targetDate: new Date('2026-08-25'),
    teamLead: 'Alex Morgan',
    ciCdConfig: {
      pipelineStatus: 'Running',
      lastBuildTime: new Date(),
      buildCount: 8,
    },
    createdAt: new Date('2026-08-05'),
    updatedAt: new Date(),
  },
  {
    _id: '64a000000000000000000003',
    name: 'CloudWatch Observability Agent',
    key: 'DOP-103',
    description: 'Real-time telemetry and resource usage aggregation with AWS CloudWatch integration.',
    category: 'DevOps Pipeline',
    status: 'Planning',
    priority: 'Medium',
    gitHubRepo: 'shivprakash/cloudwatch-agent',
    gitHubBranch: 'main',
    techStack: ['AWS CloudWatch', 'Go', 'Docker', 'Prometheus'],
    progress: 20,
    startDate: new Date('2026-08-10'),
    targetDate: new Date('2026-10-15'),
    teamLead: 'Sarah Chen',
    ciCdConfig: {
      pipelineStatus: 'Idle',
      lastBuildTime: null,
      buildCount: 0,
    },
    createdAt: new Date('2026-08-10'),
    updatedAt: new Date(),
  },
  {
    _id: '64a000000000000000000004',
    name: 'Kubernetes Pod AutoScaler Service',
    key: 'DOP-104',
    description: 'Horizontal pod autoscaling controller based on CPU/Memory thresholds and traffic spikes.',
    category: 'Cloud Infrastructure',
    status: 'Deployed',
    priority: 'High',
    gitHubRepo: 'shivprakash/k8s-autoscaler',
    gitHubBranch: 'main',
    techStack: ['Kubernetes', 'Go', 'Docker', 'AWS EKS'],
    progress: 100,
    startDate: new Date('2026-07-15'),
    targetDate: new Date('2026-08-10'),
    teamLead: 'David Miller',
    ciCdConfig: {
      pipelineStatus: 'Passed',
      lastBuildTime: new Date('2026-08-10'),
      buildCount: 22,
    },
    createdAt: new Date('2026-07-15'),
    updatedAt: new Date('2026-08-10'),
  },
];

const isDbConnected = () => mongoose.connection.readyState === 1;

// @desc    Get all projects with filtering, sorting, and search
// @route   GET /api/projects
export const getProjects = async (req, res, next) => {
  try {
    const { search, status, priority, category, sort } = req.query;

    if (isDbConnected()) {
      let query = {};

      if (status && status !== 'All') {
        query.status = status;
      }
      if (priority && priority !== 'All') {
        query.priority = priority;
      }
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { key: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { techStack: { $regex: search, $options: 'i' } },
        ];
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'progress-asc') sortOption = { progress: 1 };
      if (sort === 'progress-desc') sortOption = { progress: -1 };
      if (sort === 'name-asc') sortOption = { name: 1 };
      if (sort === 'name-desc') sortOption = { name: -1 };
      if (sort === 'priority') sortOption = { priority: 1 };

      const projects = await Project.find(query).sort(sortOption);
      return res.status(200).json({
        success: true,
        count: projects.length,
        data: projects,
      });
    }

    // Resilient fallback logic
    let filtered = [...memoryProjects];

    if (status && status !== 'All') {
      filtered = filtered.filter((p) => p.status === status);
    }
    if (priority && priority !== 'All') {
      filtered = filtered.filter((p) => p.priority === priority);
    }
    if (category && category !== 'All') {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.key.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.techStack && p.techStack.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Sort
    if (sort === 'progress-asc') filtered.sort((a, b) => a.progress - b.progress);
    else if (sort === 'progress-desc') filtered.sort((a, b) => b.progress - a.progress);
    else if (sort === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'name-desc') filtered.sort((a, b) => b.name.localeCompare(a.name));
    else filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics & summary
// @route   GET /api/projects/stats/summary
export const getProjectStats = async (req, res, next) => {
  try {
    const list = isDbConnected() ? await Project.find() : memoryProjects;

    const total = list.length;
    const inProgress = list.filter((p) => p.status === 'In Progress').length;
    const testing = list.filter((p) => p.status === 'Testing').length;
    const deployed = list.filter((p) => p.status === 'Deployed' || p.status === 'Completed').length;
    const critical = list.filter((p) => p.priority === 'Critical').length;
    const high = list.filter((p) => p.priority === 'High').length;

    const avgProgress = total > 0 ? Math.round(list.reduce((acc, curr) => acc + (curr.progress || 0), 0) / total) : 0;

    const pipelineActive = list.filter((p) => p.ciCdConfig?.pipelineStatus === 'Running').length;
    const pipelinePassed = list.filter((p) => p.ciCdConfig?.pipelineStatus === 'Passed').length;

    return res.status(200).json({
      success: true,
      data: {
        total,
        inProgress,
        testing,
        deployed,
        critical,
        high,
        avgProgress,
        pipelineStats: {
          active: pipelineActive,
          passed: pipelinePassed,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by ID
// @route   GET /api/projects/:id
export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ success: false, message: `Project with ID ${id} not found` });
      }
      return res.status(200).json({ success: true, data: project });
    }

    const project = memoryProjects.find((p) => p._id.toString() === id || p.key === id);
    if (!project) {
      return res.status(404).json({ success: false, message: `Project with ID ${id} not found` });
    }
    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
export const createProject = async (req, res, next) => {
  try {
    let {
      name,
      key,
      description,
      category,
      status,
      priority,
      gitHubRepo,
      gitHubBranch,
      techStack,
      progress,
      startDate,
      targetDate,
      teamLead,
    } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Project name is required' });
    }

    // Auto-generate project key if missing
    if (!key || key.trim() === '') {
      const cleanPrefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'PRJ');
      const randomNum = Math.floor(100 + Math.random() * 900);
      key = `${cleanPrefix}-${randomNum}`;
    } else {
      key = key.toUpperCase().trim();
    }

    // Process tech stack array
    if (typeof techStack === 'string') {
      techStack = techStack.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const newProjectData = {
      name: name.trim(),
      key,
      description: description || '',
      category: category || 'Web Application',
      status: status || 'Planning',
      priority: priority || 'Medium',
      gitHubRepo: gitHubRepo || '',
      gitHubBranch: gitHubBranch || 'main',
      techStack: techStack && techStack.length ? techStack : ['React', 'Node.js'],
      progress: Number(progress) || 0,
      startDate: startDate ? new Date(startDate) : new Date(),
      targetDate: targetDate ? new Date(targetDate) : null,
      teamLead: teamLead || 'Shiv Prakash Yadav',
      ciCdConfig: {
        pipelineStatus: 'Idle',
        lastBuildTime: null,
        buildCount: 0,
      },
    };

    if (isDbConnected()) {
      const created = await Project.create(newProjectData);
      return res.status(201).json({ success: true, data: created, message: 'Project created successfully' });
    }

    const createdMemory = {
      ...newProjectData,
      _id: new mongoose.Types.ObjectId().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryProjects.unshift(createdMemory);

    return res.status(201).json({
      success: true,
      data: createdMemory,
      message: 'Project created successfully (InMemory Mode)',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updates = { ...req.body };

    if (updates.techStack && typeof updates.techStack === 'string') {
      updates.techStack = updates.techStack.split(',').map((t) => t.trim()).filter(Boolean);
    }
    if (updates.key) {
      updates.key = updates.key.toUpperCase().trim();
    }
    if (updates.progress !== undefined) {
      updates.progress = Number(updates.progress);
    }

    if (isDbConnected()) {
      const updated = await Project.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
      if (!updated) {
        return res.status(404).json({ success: false, message: `Project with ID ${id} not found` });
      }
      return res.status(200).json({ success: true, data: updated, message: 'Project updated successfully' });
    }

    const index = memoryProjects.findIndex((p) => p._id.toString() === id || p.key === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Project with ID ${id} not found` });
    }

    memoryProjects[index] = {
      ...memoryProjects[index],
      ...updates,
      updatedAt: new Date(),
    };

    return res.status(200).json({
      success: true,
      data: memoryProjects[index],
      message: 'Project updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await Project.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: `Project with ID ${id} not found` });
      }
      return res.status(200).json({ success: true, data: {}, message: 'Project deleted successfully' });
    }

    const index = memoryProjects.findIndex((p) => p._id.toString() === id || p.key === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Project with ID ${id} not found` });
    }

    memoryProjects.splice(index, 1);
    return res.status(200).json({ success: true, data: {}, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};
