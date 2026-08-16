// Automated API Test Suite for DevOpsHub Phase 1
import http from 'http';

const BASE_URL = 'http://127.0.0.1:5000';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  const data = await response.json();
  return { status: response.status, data };
}

async function runTests() {
  console.log('🧪 Starting DevOpsHub Phase 1 Automated API Tests...\n');
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
    // 1. Test Health Endpoint
    const health = await request('/api/health');
    assert(
      health.status === 200 && health.data.status === 'healthy',
      'GET /api/health returns 200 and healthy status',
      JSON.stringify(health.data)
    );

    // 2. Test Get Projects
    const projectsList = await request('/api/projects');
    assert(
      projectsList.status === 200 && Array.isArray(projectsList.data.data),
      'GET /api/projects returns 200 and array of projects',
      `Count: ${projectsList.data?.data?.length}`
    );

    // 3. Test Get Stats Summary
    const stats = await request('/api/projects/stats/summary');
    assert(
      stats.status === 200 && typeof stats.data.data.total === 'number',
      'GET /api/projects/stats/summary returns aggregated counts',
      JSON.stringify(stats.data?.data)
    );

    // 4. Test Create Project
    const newProjectPayload = {
      name: 'Automated CI/CD Test Pipeline',
      key: 'TEST-999',
      description: 'Automated integration test project for DevOpsHub validation',
      category: 'DevOps Pipeline',
      status: 'In Progress',
      priority: 'Critical',
      gitHubRepo: 'shivprakash/test-repo',
      techStack: ['React', 'Node.js', 'Docker', 'AWS'],
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

    const createdId = createRes.data.data._id;

    // 5. Test Get Project by ID
    const getSingleRes = await request(`/api/projects/${createdId}`);
    assert(
      getSingleRes.status === 200 && getSingleRes.data.data.name === newProjectPayload.name,
      'GET /api/projects/:id returns the created project details'
    );

    // 6. Test Update Project
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

    // 7. Test Delete Project
    const deleteRes = await request(`/api/projects/${createdId}`, {
      method: 'DELETE',
    });
    assert(
      deleteRes.status === 200 && deleteRes.data.success === true,
      'DELETE /api/projects/:id successfully deletes the project'
    );

    console.log(`\n======================================================`);
    console.log(` 🎉 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
    console.log(`======================================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('💥 Test suite execution error:', err.message);
    process.exit(1);
  }
}

runTests();
