import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import projectRoutes from './routes/projectRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check Endpoint (Required for DevOps & Cloud Monitoring)
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected (in-memory mode)';
  res.status(200).json({
    status: 'healthy',
    service: 'DevOpsHub',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
  });
});

// Mount Routes
app.use('/api/projects', projectRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to DevOpsHub API - Cloud-Based Project Management & CI/CD Platform',
    endpoints: {
      health: '/api/health',
      projects: '/api/projects',
      projectStats: '/api/projects/stats/summary',
    },
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(` 🚀 DevOpsHub API Server is running on port ${PORT}`);
    console.log(` 🌐 Health Check: http://localhost:${PORT}/api/health`);
    console.log(` 📦 Projects API: http://localhost:${PORT}/api/projects`);
    console.log(`======================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Error: Port ${PORT} is already in use by another process.`);
      console.error(`👉 Solution: Stop any existing running instance or run: netstat -ano | findstr :${PORT}\n`);
    } else {
      console.error(`\n❌ Server error:`, err.message);
    }
  });
}

export default app;
