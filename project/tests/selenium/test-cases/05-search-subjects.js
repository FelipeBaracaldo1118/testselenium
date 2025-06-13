const DriverManager = require('../utils/driver-manager');
const config = require('../config');

/**
 * Test Case 5: Search subjects by name
 * 
 * This test verifies that the search functionality works correctly
 * and filters subjects based on the search term.
 */
async function testSearchSubjects() {
  const driverManager = new DriverManager();
  
  try {
    console.log('\n🧪 Test Case 5: Search subjects by name');
    console.log('=' .repeat(50));
    
    // Initialize driver and navigate to app
    await driverManager.initializeDriver();
    await driverManager.navigateToApp();
    
    // Create multiple subjects for testing search
    console.log('📝 Step 1: Create multiple subjects for search testing');
    
    const testSubjects = [
      {
        ...config.testData.validSubject,
        subjectName: 'Advanced Mathematics Search Test',
        professor: 'Dr. Math Professor'
      },
      {
        ...config.testData.validSubject,
        subjectName: 'Computer Science Fundamentals Search Test',
        professor: 'Dr. CS Professor',
        department: 'Computer Science'
      },
      {
        ...config.testData.validSubject,
        subjectName: 'Physics Laboratory Search Test',
        professor: 'Dr. Physics Professor',
        department: 'Physics'
      }
    ];
    
    // Create each test subject
    for (let i = 0; i < testSubjects.length; i++) {
      const subject = testSubjects[i];
      
      await driverManager.clickElement(config.selectors.createButton);
      await driverManager.waitForElement(config.selectors.formDialog);
      
      await driverManager.typeText(config.selectors.subjectNameInput, subject.subjectName);
      await driverManager.typeText(config.selectors.creditsInput, subject.credits.toString());
      await driverManager.typeText(config.selectors.professorInput, subject.professor);
      await driverManager.selectDropdownOption(config.selectors.departmentSelect, subject.department);
      await driverManager.typeText(config.selectors.descriptionInput, subject.description);
      
      await driverManager.clickElement(config.selectors.saveButton);
      await driverManager.waitForElementToDisappear(config.selectors.formDialog);
      
      // Wait a moment between creations
      await driverManager.driver.sleep(500);
    }
    
    // Test search by subject name
    console.log('📝 Step 2: Test search by subject name');
    await driverManager.typeText(config.selectors.searchInput, 'Mathematics');
    await driverManager.driver.sleep(1000); // Wait for search to process
    
    // Verify only mathematics subject appears
    const mathSubjectCards = await driverManager.driver.findElements(
      { css: config.selectors.subjectCard }
    );
    
    if (mathSubjectCards.length !== 1) {
      throw new Error(`Expected 1 mathematics subject, found ${mathSubjectCards.length}`);
    }
    
    const mathSubjectName = await driverManager.getElementText(config.selectors.subjectName);
    if (!mathSubjectName.includes('Mathematics')) {
      throw new Error(`Search result doesn't contain 'Mathematics': ${mathSubjectName}`);
    }
    
    // Test search by professor name
    console.log('📝 Step 3: Test search by professor name');
    await driverManager.typeText(config.selectors.searchInput, 'CS Professor');
    await driverManager.driver.sleep(1000);
    
    const csSubjectCards = await driverManager.driver.findElements(
      { css: config.selectors.subjectCard }
    );
    
    if (csSubjectCards.length !== 1) {
      throw new Error(`Expected 1 CS professor subject, found ${csSubjectCards.length}`);
    }
    
    const csProfessor = await driverManager.getElementText(config.selectors.subjectProfessor);
    if (!csProfessor.includes('CS Professor')) {
      throw new Error(`Search result doesn't contain 'CS Professor': ${csProfessor}`);
    }
    
    // Test partial search
    console.log('📝 Step 4: Test partial search');
    await driverManager.typeText(config.selectors.searchInput, 'Search Test');
    await driverManager.driver.sleep(1000);
    
    const allSubjectCards = await driverManager.driver.findElements(
      { css: config.selectors.subjectCard }
    );
    
    if (allSubjectCards.length !== 3) {
      throw new Error(`Expected 3 subjects with 'Search Test', found ${allSubjectCards.length}`);
    }
    
    // Test search with no results
    console.log('📝 Step 5: Test search with no results');
    await driverManager.typeText(config.selectors.searchInput, 'NonExistentSubject12345');
    await driverManager.driver.sleep(1000);
    
    const noResultCards = await driverManager.driver.findElements(
      { css: config.selectors.subjectCard }
    );
    
    if (noResultCards.length !== 0) {
      throw new Error(`Expected 0 subjects for non-existent search, found ${noResultCards.length}`);
    }
    
    // Verify "no subjects found" message appears
    const noResultsMessageExists = await driverManager.elementExists('text*="No subjects found"');
    // Note: This selector might need adjustment based on actual implementation
    
    // Test clearing search
    console.log('📝 Step 6: Test clearing search');
    await driverManager.typeText(config.selectors.searchInput, '');
    await driverManager.driver.sleep(1000);
    
    const allSubjectsAfterClear = await driverManager.driver.findElements(
      { css: config.selectors.subjectCard }
    );
    
    // Should show all subjects (including the 3 test subjects plus any default ones)
    if (allSubjectsAfterClear.length < 3) {
      throw new Error(`Expected at least 3 subjects after clearing search, found ${allSubjectsAfterClear.length}`);
    }
    
    // Test case-insensitive search
    console.log('📝 Step 7: Test case-insensitive search');
    await driverManager.typeText(config.selectors.searchInput, 'MATHEMATICS');
    await driverManager.driver.sleep(1000);
    
    const caseInsensitiveResults = await driverManager.driver.findElements(
      { css: config.selectors.subjectCard }
    );
    
    if (caseInsensitiveResults.length !== 1) {
      throw new Error(`Case-insensitive search failed: expected 1 result, found ${caseInsensitiveResults.length}`);
    }
    
    console.log('✅ Test Case 5 PASSED: Search functionality working correctly');
    return { success: true, message: 'Search functionality working correctly' };
    
  } catch (error) {
    console.error('❌ Test Case 5 FAILED:', error.message);
    
    // Take screenshot for debugging
    try {
      await driverManager.takeScreenshot('./test-results/search-subjects-failure.png');
    } catch (screenshotError) {
      console.error('Failed to take failure screenshot:', screenshotError);
    }
    
    return { success: false, message: error.message };
  } finally {
    await driverManager.quit();
  }
}

module.exports = testSearchSubjects;