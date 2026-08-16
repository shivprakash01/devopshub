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

// Request metrics tracker
let requestCount = 0;
let requestErrors = 0;
const startTime = Date.now();

app.use((req, res, next) => {
  requestCount++;
  res.on('finish', () => {
    if (res.statusCode >= 400) {
      requestErrors++;
    }
  });
  next();
});

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

// Prometheus Metrics Endpoint (text/plain format for Prometheus / Grafana scraping)
app.get('/api/metrics', (req, res) => {
  const memory = process.memoryUsage();
  const uptimeSeconds = (Date.now() - startTime) / 1000;
  
  const metrics = [
    '# HELP devopshub_http_requests_total Total number of HTTP requests handled',
    '# TYPE devopshub_http_requests_total counter',
    `devopshub_http_requests_total ${requestCount}`,
    '',
    '# HELP devopshub_http_request_errors_total Total number of HTTP error responses (>=400)',
    '# TYPE devopshub_http_request_errors_total counter',
    `devopshub_http_request_errors_total ${requestErrors}`,
    '',
    '# HELP devopshub_process_uptime_seconds Process uptime in seconds',
    '# TYPE devopshub_process_uptime_seconds gauge',
    `devopshub_process_uptime_seconds ${uptimeSeconds.toFixed(2)}`,
    '',
    '# HELP devopshub_memory_heap_used_bytes Process heap memory used in bytes',
    '# TYPE devopshub_memory_heap_used_bytes gauge',
    `devopshub_memory_heap_used_bytes ${memory.heapUsed}`,
    '',
    '# HELP devopshub_memory_rss_bytes Process Resident Set Size in bytes',
    '# TYPE devopshub_memory_rss_bytes gauge',
    `devopshub_memory_rss_bytes ${memory.rss}`,
    '',
    '# HELP devopshub_database_connection_status MongoDB connection state (1=connected, 0=disconnected)',
    '# TYPE devopshub_database_connection_status gauge',
    `devopshub_database_connection_status ${mongoose.connection.readyState === 1 ? 1 : 0}`,
  ].join('\n');

  res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  res.status(200).send(metrics);
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
