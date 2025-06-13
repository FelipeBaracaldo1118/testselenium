const fs = require('fs');
const path = require('path');

// Import all test cases
const testCreateSubject = require('./test-cases/01-create-subject');
const testValidateRequiredFields = require('./test-cases/02-validate-required-fields');
const testEditSubject = require('./test-cases/03-edit-subject');
const testDeleteSubject = require('./test-cases/04-delete-subject');
const testSearchSubjects = require('./test-cases/05-search-subjects');
const testFilterByDepartment = require('./test-cases/06-filter-by-department');
const testInvalidDataCreation = require('./test-cases/07-invalid-data-test');
const testPagination = require('./test-cases/08-pagination-test');
const testCancelEdit = require('./test-cases/09-cancel-edit');
const testSuccessNotifications = require('./test-cases/10-success-notifications');

/**
 * Main test runner for Selenium test suite
 * 
 * This script runs all 10 test cases in sequence and generates a comprehensive report.
 */
async function runAllTests() {
  console.log('🚀 Starting Selenium Test Suite for Subject CRUD Application');
  console.log('=' .repeat(70));
  console.log(`📅 Test Run Date: ${new Date().toISOString()}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=' .repeat(70));
  
  // Ensure test results directory exists
  const resultsDir = './test-results';
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  // Define all test cases
  const testCases = [
    { name: 'Create new subject successfully', func: testCreateSubject },
    { name: 'Validate required fields on create', func: testValidateRequiredFields },
    { name: 'Edit existing subject', func: testEditSubject },
    { name: 'Delete subject with confirmation', func: testDeleteSubject },
    { name: 'Search subjects by name', func: testSearchSubjects },
    { name: 'Filter subjects by department', func: testFilterByDepartment },
    { name: 'Attempt create with invalid data', func: testInvalidDataCreation },
    { name: 'Verify subject list pagination', func: testPagination },
    { name: 'Cancel edit operation', func: testCancelEdit },
    { name: 'Verify success notifications', func: testSuccessNotifications },
  ];
  
  const results = [];
  const startTime = Date.now();
  
  // Run each test case
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const testStartTime = Date.now();
    
    console.log(`\n📋 Running Test ${i + 1}/${testCases.length}: ${testCase.name}`);
    
    try {
      const result = await testCase.func();
      const testEndTime = Date.now();
      const duration = testEndTime - testStartTime;
      
      results.push({
        testNumber: i + 1,
        name: testCase.name,
        status: result.success ? 'PASSED' : 'FAILED',
        message: result.message,
        duration: duration,
        timestamp: new Date().toISOString(),
      });
      
      if (result.success) {
        console.log(`✅ Test ${i + 1} PASSED (${duration}ms): ${result.message}`);
      } else {
        console.log(`❌ Test ${i + 1} FAILED (${duration}ms): ${result.message}`);
      }
      
    } catch (error) {
      const testEndTime = Date.now();
      const duration = testEndTime - testStartTime;
      
      console.log(`💥 Test ${i + 1} CRASHED (${duration}ms): ${error.message}`);
      
      results.push({
        testNumber: i + 1,
        name: testCase.name,
        status: 'CRASHED',
        message: error.message,
        duration: duration,
        timestamp: new Date().toISOString(),
      });
    }
    
    // Add delay between tests to prevent overwhelming the system
    if (i < testCases.length - 1) {
      console.log('⏳ Waiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  const endTime = Date.now();
  const totalDuration = endTime - startTime;
  
  // Generate test report
  generateTestReport(results, totalDuration);
  
  // Print summary
  printTestSummary(results, totalDuration);
  
  // Exit with appropriate code
  const failedTests = results.filter(r => r.status !== 'PASSED');
  process.exit(failedTests.length > 0 ? 1 : 0);
}

/**
 * Generate detailed test report
 */
function generateTestReport(results, totalDuration) {
  const report = {
    summary: {
      totalTests: results.length,
      passed: results.filter(r => r.status === 'PASSED').length,
      failed: results.filter(r => r.status === 'FAILED').length,
      crashed: results.filter(r => r.status === 'CRASHED').length,
      totalDuration: totalDuration,
      timestamp: new Date().toISOString(),
    },
    testResults: results,
  };
  
  // Save JSON report
  const jsonReportPath = './test-results/test-report.json';
  fs.writeFileSync(jsonReportPath, JSON.stringify(report, null, 2));
  
  // Generate HTML report
  const htmlReport = generateHtmlReport(report);
  const htmlReportPath = './test-results/test-report.html';
  fs.writeFileSync(htmlReportPath, htmlReport);
  
  console.log(`\n📊 Test reports generated:`);
  console.log(`   JSON: ${jsonReportPath}`);
  console.log(`   HTML: ${htmlReportPath}`);
}

/**
 * Generate HTML test report
 */
function generateHtmlReport(report) {
  const { summary, testResults } = report;
  
  const statusColor = (status) => {
    switch (status) {
      case 'PASSED': return '#22c55e';
      case 'FAILED': return '#ef4444';
      case 'CRASHED': return '#f97316';
      default: return '#6b7280';
    }
  };
  
  const testRows = testResults.map(test => `
    <tr>
      <td>${test.testNumber}</td>
      <td>${test.name}</td>
      <td style="color: ${statusColor(test.status)}; font-weight: bold;">${test.status}</td>
      <td>${test.duration}ms</td>
      <td>${test.message}</td>
    </tr>
  `).join('');
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Selenium Test Report - Subject CRUD Application</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #333; text-align: center; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
        .summary-card { background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center; }
        .summary-card h3 { margin: 0 0 10px 0; color: #666; }
        .summary-card .value { font-size: 24px; font-weight: bold; }
        .passed { color: #22c55e; }
        .failed { color: #ef4444; }
        .crashed { color: #f97316; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: bold; }
        tr:hover { background-color: #f8f9fa; }
        .timestamp { text-align: center; color: #666; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Selenium Test Report</h1>
        <h2>Subject CRUD Application</h2>
        
        <div class="summary">
            <div class="summary-card">
                <h3>Total Tests</h3>
                <div class="value">${summary.totalTests}</div>
            </div>
            <div class="summary-card">
                <h3>Passed</h3>
                <div class="value passed">${summary.passed}</div>
            </div>
            <div class="summary-card">
                <h3>Failed</h3>
                <div class="value failed">${summary.failed}</div>
            </div>
            <div class="summary-card">
                <h3>Crashed</h3>
                <div class="value crashed">${summary.crashed}</div>
            </div>
            <div class="summary-card">
                <h3>Duration</h3>
                <div class="value">${Math.round(summary.totalDuration / 1000)}s</div>
            </div>
        </div>
        
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Test Case</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Message</th>
                </tr>
            </thead>
            <tbody>
                ${testRows}
            </tbody>
        </table>
        
        <div class="timestamp">
            Generated on ${new Date(summary.timestamp).toLocaleString()}
        </div>
    </div>
</body>
</html>
  `;
}

/**
 * Print test summary to console
 */
function printTestSummary(results, totalDuration) {
  console.log('\n' + '=' .repeat(70));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(70));
  
  const passed = results.filter(r => r.status === 'PASSED').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  const crashed = results.filter(r => r.status === 'CRASHED').length;
  
  console.log(`📈 Total Tests: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`💥 Crashed: ${crashed}`);
  console.log(`⏱️  Total Duration: ${Math.round(totalDuration / 1000)}s`);
  console.log(`📊 Success Rate: ${Math.round((passed / results.length) * 100)}%`);
  
  if (failed > 0 || crashed > 0) {
    console.log('\n❌ FAILED/CRASHED TESTS:');
    results.filter(r => r.status !== 'PASSED').forEach(test => {
      console.log(`   ${test.testNumber}. ${test.name}: ${test.message}`);
    });
  }
  
  console.log('\n' + '=' .repeat(70));
  
  if (passed === results.length) {
    console.log('🎉 ALL TESTS PASSED! The Subject CRUD application is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please review the results and fix the issues.');
  }
  
  console.log('=' .repeat(70));
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run the tests
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('💥 Test runner crashed:', error);
    process.exit(1);
  });
}

module.exports = runAllTests;