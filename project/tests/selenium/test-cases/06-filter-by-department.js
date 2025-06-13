const DriverManager = require('../utils/driver-manager');
const config = require('../config');

/**
 * Test Case 6: Filter subjects by department
 * 
 * This test verifies that the department filter works correctly
 * and only shows subjects from the selected department.
 */
async function testFilterByDepartment() {
  const driverManager = new DriverManager();
  
  try {
    console.log('\n🧪 Test Case 6: Filter subjects by department');
    console.log('=' .repeat(50));
    
    // Initialize driver and navigate to app
    await driverManager.initializeDriver();
    await driverManager.navigateToApp();
    
    // Create subjects in different departments
    console.log('📝 Step 1: Create subjects in different departments');
    
    const testSubjects = [
      {
        ...config.testData.validSubject,
        subjectName: 'CS Filter Test Subject 1',
        department: 'Computer Science'
      },
      {
        ...config.testData.validSubject,
        subjectName: 'CS Filter Test Subject 2', 
        department: 'Computer Science'
      },
      {
        ...config.testData.validSubject,
        subjectName: 'Math Filter Test Subject',
        department: 'Mathematics'
      },
      {
        ...config.testData.validSubject,
        subjectName: 'Physics Filter Test Subject',
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
    
    // Test filtering by Computer Science
    console.log('📝 Step 2: Filter by Computer Science department');
    await driverManager.selectDropdownOption(config.selectors.departmentFilter, 'Computer Science');
    await driverManager.driver.sleep(1000); // Wait for filter to process
    
    // Verify only Computer Science subjects appear
    const csSubjectCards = await driverManager.driver.findElements(
      { css: config.selectors.subjectCard }
    );
    
    // Should show CS subjects (2 created + any existing CS subjects)
    if (csSubjectCards.length < 2) {
      throw new Error(`Expected at least 2 CS subjects, found ${csSubjectCards.length}`);
    }
    
    // Verify all displayed subjects are from Computer Science department
    for (let i = 0; i < Math.min(csSubjectCards.length, 3); i++) {
      const card = csSubjectCards[i];
      const cardText = await card.getText();
      
      if (!cardText.includes('Computer Science')) {
        throw new Error(`Non-CS subject found in CS filter results: ${cardText}`);
      }
    }
    
    // Test filtering by Mathematics
    console.log('📝 Step 3: Filter by Mathematics department');
    await driverManager.selectDropdownOption(config.selectors.departmentFilter, 'Mathematics');
    await driverManager.driver.sleep(1000);
    
    const mathSubjectCards = await driverManager.driver.findElements(
      { css: config.selectors.subjectCard }
    );
    
    // Should show at least 1 Mathematics subject
    if (mathSubjectCards.length < 1) {
      throw new Error(`Expected at least 1 Math subject, found ${mathSubjectCards.length}`);
    }
    
    // Verify displayed subjects are from Mathematics department
    const mathCardText = await mathSubjectCards[0].getText();
    if (!mathCardText.includes('Mathematics')) {
      throw new Error(`Non-Math subject found in Math filter results: ${mathCardText}`);
    }
    
    // Test filtering by Physics
    console.log('📝 Step 4: Filter by Physics department');
    await driverManager.selectDropdownOption(config.selectors.departmentFilter, 'Physics');
    await driverManager.driver.sleep(1000);
    
    const physicsSubjectCards = await driverManager.driver.findElements(
      { css: config.selectors.subjectCard }
    );
    
    // Should show at least 1 Physics subject
    if (physicsSubjectCards.length < 1) {
      throw new Error(`Expected at least 1 Physics subject, found ${physicsSubjectCards.length}`);
    }
    
    // Test clearing filter (show all departments)
    console.log('📝 Step 5: Clear department filter');
    await driverManager.selectDropdownOption(config.selectors.departmentFilter, 'All Departments');
    await driverManager.driver.sleep(1000);
    
    const allSubjectCards = await driverManager.driver.findElements(
      { css: config.selectors.subjectCard }
    );
    
    // Should show all subjects (at least the 4 we created)
    if (allSubjectCards.length < 4) {
      throw new Error(`Expected at least 4 subjects when no filter applied, found ${allSubjectCards.length}`);
    }
    
    // Test combining search and department filter
    console.log('📝 Step 6: Test combining search with department filter');
    await driverManager.typeText(config.selectors.searchInput, 'Filter Test');
    await driverManager.selectDropdownOption(config.selectors.departmentFilter, 'Computer Science');
    await driverManager.driver.sleep(1000);
    
    const filteredSearchResults = await driverManager.driver.findElements(
      { css: config.selectors.subjectCard }
    );
    
    // Should show only CS subjects with "Filter Test" in the name (2 subjects)
    if (filteredSearchResults.length !== 2) {
      throw new Error(`Expected 2 CS subjects with 'Filter Test', found ${filteredSearchResults.length}`);
    }
    
    // Verify results match both criteria
    for (let i = 0; i < filteredSearchResults.length; i++) {
      const cardText = await filteredSearchResults[i].getText();
      if (!cardText.includes('Computer Science') || !cardText.includes('Filter Test')) {
        throw new Error(`Result doesn't match combined filter criteria: ${cardText}`);
      }
    }
    
    console.log('✅ Test Case 6 PASSED: Department filtering working correctly');
    return { success: true, message: 'Department filtering working correctly' };
    
  } catch (error) {
    console.error('❌ Test Case 6 FAILED:', error.message);
    
    // Take screenshot for debugging
    try {
      await driverManager.takeScreenshot('./test-results/filter-department-failure.png');
    } catch (screenshotError) {
      console.error('Failed to take failure screenshot:', screenshotError);
    }
    
    return { success: false, message: error.message };
  } finally {
    await driverManager.quit();
  }
}

module.exports = testFilterByDepartment;