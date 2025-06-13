const DriverManager = require('../utils/driver-manager');
const config = require('../config');

/**
 * Test Case 2: Validate required fields on create
 * 
 * This test verifies that the form properly validates required fields
 * and displays appropriate error messages when invalid data is entered.
 */
async function testValidateRequiredFields() {
  const driverManager = new DriverManager();
  
  try {
    console.log('\n🧪 Test Case 2: Validate required fields on create');
    console.log('=' .repeat(50));
    
    // Initialize driver and navigate to app
    await driverManager.initializeDriver();
    await driverManager.navigateToApp();
    
    // Click create button to open form
    console.log('📝 Step 1: Open create subject form');
    await driverManager.clickElement(config.selectors.createButton);
    await driverManager.waitForElement(config.selectors.formDialog);
    
    // Test submitting empty form
    console.log('📝 Step 2: Submit empty form');
    await driverManager.clickElement(config.selectors.saveButton);
    
    // Verify validation errors appear
    console.log('📝 Step 3: Verify validation errors for empty fields');
    const errorExists = await driverManager.elementExists(config.selectors.fieldError);
    if (!errorExists) {
      throw new Error('Validation errors not displayed for empty form');
    }
    
    // Test invalid data
    console.log('📝 Step 4: Test with invalid data');
    const invalidData = config.testData.invalidSubject;
    
    // Subject name too short
    await driverManager.typeText(config.selectors.subjectNameInput, invalidData.subjectName);
    await driverManager.clickElement(config.selectors.saveButton);
    
    const nameError = await driverManager.elementExists(config.selectors.fieldError);
    if (!nameError) {
      throw new Error('Validation error not shown for short subject name');
    }
    
    // Clear and test credits validation
    await driverManager.typeText(config.selectors.subjectNameInput, 'Valid Subject Name');
    await driverManager.typeText(config.selectors.creditsInput, invalidData.credits.toString());
    await driverManager.clickElement(config.selectors.saveButton);
    
    // Wait a moment for validation
    await driverManager.driver.sleep(500);
    
    const creditsError = await driverManager.elementExists(config.selectors.fieldError);
    if (!creditsError) {
      throw new Error('Validation error not shown for invalid credits');
    }
    
    // Test empty professor field
    console.log('📝 Step 5: Test empty professor field');
    await driverManager.typeText(config.selectors.creditsInput, '3'); // Fix credits
    await driverManager.typeText(config.selectors.professorInput, ''); // Empty professor
    await driverManager.clickElement(config.selectors.saveButton);
    
    await driverManager.driver.sleep(500);
    
    const professorError = await driverManager.elementExists(config.selectors.fieldError);
    if (!professorError) {
      throw new Error('Validation error not shown for empty professor');
    }
    
    // Test description too short
    console.log('📝 Step 6: Test description too short');
    await driverManager.typeText(config.selectors.professorInput, 'Dr. Test');
    await driverManager.selectDropdownOption(config.selectors.departmentSelect, 'Computer Science');
    await driverManager.typeText(config.selectors.descriptionInput, 'Short');
    await driverManager.clickElement(config.selectors.saveButton);
    
    await driverManager.driver.sleep(500);
    
    const descError = await driverManager.elementExists(config.selectors.fieldError);
    if (!descError) {
      throw new Error('Validation error not shown for short description');
    }
    
    // Verify form doesn't submit with invalid data
    console.log('📝 Step 7: Verify form remains open with errors');
    const formStillOpen = await driverManager.elementExists(config.selectors.formDialog);
    if (!formStillOpen) {
      throw new Error('Form closed despite validation errors');
    }
    
    // Test canceling the form
    console.log('📝 Step 8: Test cancel functionality');
    await driverManager.clickElement(config.selectors.cancelButton);
    
    // Verify form closes
    await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    
    console.log('✅ Test Case 2 PASSED: Required field validation working correctly');
    return { success: true, message: 'Required field validation working correctly' };
    
  } catch (error) {
    console.error('❌ Test Case 2 FAILED:', error.message);
    
    // Take screenshot for debugging
    try {
      await driverManager.takeScreenshot('./test-results/validate-fields-failure.png');
    } catch (screenshotError) {
      console.error('Failed to take failure screenshot:', screenshotError);
    }
    
    return { success: false, message: error.message };
  } finally {
    await driverManager.quit();
  }
}

module.exports = testValidateRequiredFields;