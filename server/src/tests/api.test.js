import mongoose from 'mongoose';
import app from '../server.js';

const PORT = 5098;
let serverInstance = null;
let BASE_URL = `http://127.0.0.1:${PORT}`;

async function startTestServer() {
  return new Promise((resolve) => {
    serverInstance = app.listen(PORT, '127.0.0.1', () => {
      resolve();
    });
  });
}

async function stopTestServer() {
  try {
    if (serverInstance) {
      serverInstance.close();
    }
    await mongoose.connection.close();
  } catch (e) {
    // ignore
  }
}

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  const contentType = response.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }
  return { status: response.status, data };
}

async function runTests() {
  console.log('🧪 Starting DevOpsHub Automated API Tests...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(` ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(` ❌ FAIL: ${testName} - ${details}`);
      failed++;
    }
  };

  try {
    await startTestServer();

    // 1. Test Health Endpoint
    const health = await request('/api/health');
    assert(
      health.status === 200 && health.data.status === 'healthy',
      'GET /api/health returns 200 and healthy status',
      JSON.stringify(health.data)
    );

    // 2. Test Prometheus Metrics Endpoint
    const metrics = await request('/api/metrics');
    assert(
      metrics.status === 200 && typeof metrics.data === 'string' && metrics.data.includes('devopshub_http_requests_total'),
      'GET /api/metrics returns 200 and Prometheus exposition format'
    );

    // 3. Test Get Projects
    const projectsList = await request('/api/projects');
    assert(
      projectsList.status === 200 && Array.isArray(projectsList.data.data),
      'GET /api/projects returns 200 and array of projects',
      `Count: ${projectsList.data?.data?.length}`
    );

    // 4. Test Get Stats Summary
    const stats = await request('/api/projects/stats/summary');
    assert(
      stats.status === 200 && typeof stats.data.data.total === 'number',
      'GET /api/projects/stats/summary returns aggregated counts',
      JSON.stringify(stats.data?.data)
    );

    // 5. Test Create Project
    const newProjectPayload = {
      name: 'Automated CI/CD Test Pipeline',
      key: `TEST-${Date.now().toString().slice(-4)}`,
      description: 'Automated integration test project for DevOpsHub validation',
      category: 'DevOps Pipeline',
      status: 'In Progress',
      priority: 'Critical',
      gitHubRepo: 'shivprakash01/devopshub',
      techStack: ['React', 'Node.js', 'Docker', 'Kubernetes'],
      progress: 50,
      teamLead: 'Shiv Prakash Yadav',
    };

    const createRes = await request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(newProjectPayload),
    });

    assert(
      createRes.status === 201 && createRes.data.success === true,
      'POST /api/projects creates a new project with 201 status',
      JSON.stringify(createRes.data)
    );

    const createdId = createRes.data?.data?._id;

    // 6. Test Get Project by ID
    if (createdId) {
      const getSingleRes = await request(`/api/projects/${createdId}`);
      assert(
        getSingleRes.status === 200 && getSingleRes.data.data.name === newProjectPayload.name,
        'GET /api/projects/:id returns the created project details'
      );

      // 7. Test Update Project
      const updatePayload = {
        progress: 90,
        status: 'Completed',
        description: 'Updated through automated test execution',
      };
      const updateRes = await request(`/api/projects/${createdId}`, {
        method: 'PUT',
        body: JSON.stringify(updatePayload),
      });
      assert(
        updateRes.status === 200 && updateRes.data.data.progress === 90 && updateRes.data.data.status === 'Completed',
        'PUT /api/projects/:id updates project fields successfully'
      );

      // 8. Test Delete Project
      const deleteRes = await request(`/api/projects/${createdId}`, {
        method: 'DELETE',
      });
      assert(
        deleteRes.status === 200 && deleteRes.data.success === true,
        'DELETE /api/projects/:id successfully deletes the project'
      );
    }

    console.log(`\n======================================================`);
    console.log(` 🎉 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
    console.log(`======================================================\n`);

    await stopTestServer();
    process.exit(0);
  } catch (err) {
    console.error('💥 Test suite execution error:', err.message);
    await stopTestServer();
    process.exit(1);
  }
}

runTests();
