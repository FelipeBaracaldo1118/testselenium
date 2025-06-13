const DriverManager = require('../utils/driver-manager');
const config = require('../config');

/**
 * Test Case 7: Attempt create with invalid data
 * 
 * This test verifies that the application properly handles various
 * types of invalid data and prevents submission with appropriate errors.
 */
async function testInvalidDataCreation() {
  const driverManager = new DriverManager();
  
  try {
    console.log('\n🧪 Test Case 7: Attempt create with invalid data');
    console.log('=' .repeat(50));
    
    // Initialize driver and navigate to app
    await driverManager.initializeDriver();
    await driverManager.navigateToApp();
    
    // Test Case 7a: Special characters in subject name
    console.log('📝 Step 1: Test special characters in subject name');
    await driverManager.clickElement(config.selectors.createButton);
    await driverManager.waitForElement(config.selectors.formDialog);
    
    await driverManager.typeText(config.selectors.subjectNameInput, 'Subject with <script>alert("XSS")</script>');
    await driverManager.typeText(config.selectors.creditsInput, '3');
    await driverManager.typeText(config.selectors.professorInput, 'Dr. Test');
    await driverManager.selectDropdownOption(config.selectors.departmentSelect, 'Computer Science');
    await driverManager.typeText(config.selectors.descriptionInput, 'Valid description for testing special characters.');
    
    await driverManager.clickElement(config.selectors.saveButton);
    
    // Should show validation error or sanitize input
    const errorExists = await driverManager.elementExists(config.selectors.fieldError);
    if (!errorExists) {
      // If no error, check if form was submitted (it shouldn't be with malicious content)
      const formStillOpen = await driverManager.elementExists(config.selectors.formDialog);
      if (!formStillOpen) {
        throw new Error('Form submitted with potentially malicious content');
      }
    }
    
    // Close the form to reset
    await driverManager.clickElement(config.selectors.cancelButton);
    await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    
    // Test Case 7b: Extremely long input values
    console.log('📝 Step 2: Test extremely long input values');
    await driverManager.clickElement(config.selectors.createButton);
    await driverManager.waitForElement(config.selectors.formDialog);
    
    const longString = 'A'.repeat(200); // 200 characters - exceeds typical limits
    
    await driverManager.typeText(config.selectors.subjectNameInput, longString);
    await driverManager.typeText(config.selectors.creditsInput, '3');
    await driverManager.typeText(config.selectors.professorInput, 'Dr. Test');
    await driverManager.selectDropdownOption(config.selectors.departmentSelect, 'Computer Science');
    await driverManager.typeText(config.selectors.descriptionInput, 'Valid description.');
    
    await driverManager.clickElement(config.selectors.saveButton);
    
    // Should show validation error for too long input
    const longInputError = await driverManager.elementExists(config.selectors.fieldError);
    if (!longInputError) {
      throw new Error('No validation error for excessively long subject name');
    }
    
    // Reset form
    await driverManager.clickElement(config.selectors.cancelButton);
    await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    
    // Test Case 7c: Invalid credit values
    console.log('📝 Step 3: Test invalid credit values');
    await driverManager.clickElement(config.selectors.createButton);
    await driverManager.waitForElement(config.selectors.formDialog);
    
    // Test negative credits
    await driverManager.typeText(config.selectors.subjectNameInput, 'Valid Subject Name');
    await driverManager.typeText(config.selectors.creditsInput, '-5');
    await driverManager.typeText(config.selectors.professorInput, 'Dr. Test');
    await driverManager.selectDropdownOption(config.selectors.departmentSelect, 'Computer Science');
    await driverManager.typeText(config.selectors.descriptionInput, 'Valid description for testing.');
    
    await driverManager.clickElement(config.selectors.saveButton);
    
    const negativeCreditsError = await driverManager.elementExists(config.selectors.fieldError);
    if (!negativeCreditsError) {
      throw new Error('No validation error for negative credits');
    }
    
    // Test credits above maximum
    await driverManager.typeText(config.selectors.creditsInput, '15');
    await driverManager.clickElement(config.selectors.saveButton);
    
    const highCreditsError = await driverManager.elementExists(config.selectors.fieldError);
    if (!highCreditsError) {
      throw new Error('No validation error for credits above maximum');
    }
    
    // Test zero credits
    await driverManager.typeText(config.selectors.creditsInput, '0');
    await driverManager.clickElement(config.selectors.saveButton);
    
    const zeroCreditsError = await driverManager.elementExists(config.selectors.fieldError);
    if (!zeroCreditsError) {
      throw new Error('No validation error for zero credits');
    }
    
    // Reset form
    await driverManager.clickElement(config.selectors.cancelButton);
    await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    
    // Test Case 7d: Invalid professor names
    console.log('📝 Step 4: Test invalid professor names');
    await driverManager.clickElement(config.selectors.createButton);
    await driverManager.waitForElement(config.selectors.formDialog);
    
    // Test professor name with numbers
    await driverManager.typeText(config.selectors.subjectNameInput, 'Valid Subject Name');
    await driverManager.typeText(config.selectors.creditsInput, '3');
    await driverManager.typeText(config.selectors.professorInput, 'Dr. Test123 Professor');
    await driverManager.selectDropdownOption(config.selectors.departmentSelect, 'Computer Science');
    await driverManager.typeText(config.selectors.descriptionInput, 'Valid description for testing.');
    
    await driverManager.clickElement(config.selectors.saveButton);
    
    const invalidProfessorError = await driverManager.elementExists(config.selectors.fieldError);
    if (!invalidProfessorError) {
      throw new Error('No validation error for professor name with numbers');
    }
    
    // Reset form
    await driverManager.clickElement(config.selectors.cancelButton);
    await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    
    // Test Case 7e: SQL injection attempt
    console.log('📝 Step 5: Test SQL injection attempt');
    await driverManager.clickElement(config.selectors.createButton);
    await driverManager.waitForElement(config.selectors.formDialog);
    
    const sqlInjection = "'; DROP TABLE subjects; --";
    
    await driverManager.typeText(config.selectors.subjectNameInput, sqlInjection);
    await driverManager.typeText(config.selectors.creditsInput, '3');
    await driverManager.typeText(config.selectors.professorInput, 'Dr. Test');
    await driverManager.selectDropdownOption(config.selectors.departmentSelect, 'Computer Science');
    await driverManager.typeText(config.selectors.descriptionInput, 'Testing SQL injection prevention.');
    
    await driverManager.clickElement(config.selectors.saveButton);
    
    // Should either show validation error or sanitize input
    const sqlError = await driverManager.elementExists(config.selectors.fieldError);
    if (!sqlError) {
      // If no client-side error, the form might be submitted but should be handled safely server-side
      console.log('⚠️  SQL injection input was accepted client-side - should be handled server-side');
    }
    
    // Cancel form
    await driverManager.clickElement(config.selectors.cancelButton);
    await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    
    // Test Case 7f: Mixed valid and invalid data
    console.log('📝 Step 6: Test mixed valid and invalid data');
    await driverManager.clickElement(config.selectors.createButton);
    await driverManager.waitForElement(config.selectors.formDialog);
    
    // Valid subject name and description, but invalid credits and professor
    await driverManager.typeText(config.selectors.subjectNameInput, 'Valid Subject Name');
    await driverManager.typeText(config.selectors.creditsInput, '20'); // Invalid: too high
    await driverManager.typeText(config.selectors.professorInput, ''); // Invalid: empty
    await driverManager.selectDropdownOption(config.selectors.departmentSelect, 'Computer Science');
    await driverManager.typeText(config.selectors.descriptionInput, 'This is a valid description for testing purposes.');
    
    await driverManager.clickElement(config.selectors.saveButton);
    
    // Should show multiple validation errors
    const multipleErrors = await driverManager.driver.findElements(
      { css: config.selectors.fieldError }
    );
    
    if (multipleErrors.length < 2) {
      throw new Error(`Expected multiple validation errors, found ${multipleErrors.length}`);
    }
    
    // Form should remain open
    const formStillOpen = await driverManager.elementExists(config.selectors.formDialog);
    if (!formStillOpen) {
      throw new Error('Form closed despite validation errors');
    }
    
    await driverManager.clickElement(config.selectors.cancelButton);
    
    console.log('✅ Test Case 7 PASSED: Invalid data properly handled with appropriate errors');
    return { success: true, message: 'Invalid data properly handled with appropriate errors' };
    
  } catch (error) {
    console.error('❌ Test Case 7 FAILED:', error.message);
    
    // Take screenshot for debugging
    try {
      await driverManager.takeScreenshot('./test-results/invalid-data-failure.png');
    } catch (screenshotError) {
      console.error('Failed to take failure screenshot:', screenshotError);
    }
    
    return { success: false, message: error.message };
  } finally {
    await driverManager.quit();
  }
}

module.exports = testInvalidDataCreation;