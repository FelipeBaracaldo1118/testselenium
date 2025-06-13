const DriverManager = require('../utils/driver-manager');
const config = require('../config');

/**
 * Test Case 1: Create new subject successfully
 * 
 * This test verifies that users can successfully create a new subject
 * with valid data and see it appear in the subject list.
 */
async function testCreateSubject() {
  const driverManager = new DriverManager();
  
  try {
    console.log('\n🧪 Test Case 1: Create new subject successfully');
    console.log('=' .repeat(50));
    
    // Initialize driver and navigate to app
    await driverManager.initializeDriver();
    await driverManager.navigateToApp();
    
    // Wait for page to load and click create button
    console.log('📝 Step 1: Click create subject button');
    await driverManager.clickElement(config.selectors.createButton);
    
    // Verify form dialog opens
    console.log('📝 Step 2: Verify form dialog opens');
    await driverManager.waitForElement(config.selectors.formDialog);
    
    // Fill out the form with valid data
    console.log('📝 Step 3: Fill out form with valid data');
    const testData = config.testData.validSubject;
    
    await driverManager.typeText(config.selectors.subjectNameInput, testData.subjectName);
    await driverManager.typeText(config.selectors.creditsInput, testData.credits.toString());
    await driverManager.typeText(config.selectors.professorInput, testData.professor);
    
    // Select department from dropdown
    await driverManager.selectDropdownOption(config.selectors.departmentSelect, testData.department);
    
    await driverManager.typeText(config.selectors.descriptionInput, testData.description);
    
    // Submit the form
    console.log('📝 Step 4: Submit the form');
    await driverManager.clickElement(config.selectors.saveButton);
    
    // Wait for form to close
    console.log('📝 Step 5: Wait for form to close');
    await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    
    // Verify success notification
    console.log('📝 Step 6: Verify success notification');
    const successNotification = await driverManager.elementExists(config.selectors.successToast);
    if (!successNotification) {
      throw new Error('Success notification not displayed');
    }
    
    // Search for the newly created subject
    console.log('📝 Step 7: Search for newly created subject');
    await driverManager.typeText(config.selectors.searchInput, testData.subjectName);
    
    // Wait a moment for search to process
    await driverManager.driver.sleep(1000);
    
    // Verify subject appears in the list
    console.log('📝 Step 8: Verify subject appears in list');
    const subjectExists = await driverManager.elementExists(config.selectors.subjectCard);
    if (!subjectExists) {
      throw new Error('Created subject not found in the list');
    }
    
    // Verify subject details are correct
    console.log('📝 Step 9: Verify subject details');
    const displayedName = await driverManager.getElementText(config.selectors.subjectName);
    const displayedProfessor = await driverManager.getElementText(config.selectors.subjectProfessor);
    
    if (!displayedName.includes(testData.subjectName)) {
      throw new Error(`Subject name mismatch: expected "${testData.subjectName}", found "${displayedName}"`);
    }
    
    if (!displayedProfessor.includes(testData.professor)) {
      throw new Error(`Professor name mismatch: expected "${testData.professor}", found "${displayedProfessor}"`);
    }
    
    console.log('✅ Test Case 1 PASSED: Subject created successfully');
    return { success: true, message: 'Subject created successfully' };
    
  } catch (error) {
    console.error('❌ Test Case 1 FAILED:', error.message);
    
    // Take screenshot for debugging
    try {
      await driverManager.takeScreenshot('./test-results/create-subject-failure.png');
    } catch (screenshotError) {
      console.error('Failed to take failure screenshot:', screenshotError);
    }
    
    return { success: false, message: error.message };
  } finally {
    await driverManager.quit();
  }
}

module.exports = testCreateSubject;