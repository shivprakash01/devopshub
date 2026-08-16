import express from 'express';
import {
  getProjects,
  getProjectStats,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';

const router = express.Router();

// Summary stats route (must be before :id route)
router.get('/stats/summary', getProjectStats);

// Main project CRUD routes
router.route('/').get(getProjects).post(createProject);

router.route('/:id').get(getProjectById).put(updateProject).delete(deleteProject);

export default router;
