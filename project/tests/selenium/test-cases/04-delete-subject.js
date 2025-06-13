const DriverManager = require('../utils/driver-manager');
const config = require('../config');

/**
 * Test Case 4: Delete subject with confirmation
 * 
 * This test verifies that users can delete a subject and that
 * a confirmation dialog appears before deletion.
 */
async function testDeleteSubject() {
  const driverManager = new DriverManager();
  
  try {
    console.log('\n🧪 Test Case 4: Delete subject with confirmation');
    console.log('=' .repeat(50));
    
    // Initialize driver and navigate to app
    await driverManager.initializeDriver();
    await driverManager.navigateToApp();
    
    // First, create a subject to delete
    console.log('📝 Step 1: Create a subject to delete');
    await driverManager.clickElement(config.selectors.createButton);
    await driverManager.waitForElement(config.selectors.formDialog);
    
    const testData = {
      ...config.testData.validSubject,
      subjectName: 'Subject to Delete - Test'
    };
    
    await driverManager.typeText(config.selectors.subjectNameInput, testData.subjectName);
    await driverManager.typeText(config.selectors.creditsInput, testData.credits.toString());
    await driverManager.typeText(config.selectors.professorInput, testData.professor);
    await driverManager.selectDropdownOption(config.selectors.departmentSelect, testData.department);
    await driverManager.typeText(config.selectors.descriptionInput, testData.description);
    
    await driverManager.clickElement(config.selectors.saveButton);
    await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    
    // Search for the created subject
    await driverManager.typeText(config.selectors.searchInput, testData.subjectName);
    await driverManager.driver.sleep(1000);
    
    // Verify subject exists before deletion
    console.log('📝 Step 2: Verify subject exists before deletion');
    const subjectExists = await driverManager.elementExists(config.selectors.subjectCard);
    if (!subjectExists) {
      throw new Error('Subject to delete not found');
    }
    
    // Click delete button
    console.log('📝 Step 3: Click delete button');
    const deleteButtons = await driverManager.driver.findElements(
      { css: '[data-testid^="delete-subject-"]' }
    );
    
    if (deleteButtons.length === 0) {
      throw new Error('No delete button found');
    }
    
    await deleteButtons[0].click();
    
    // Verify confirmation dialog appears
    console.log('📝 Step 4: Verify confirmation dialog appears');
    await driverManager.waitForElement(config.selectors.deleteDialog);
    
    // Verify dialog contains subject name
    const dialogText = await driverManager.getElementText(config.selectors.deleteDialog);
    if (!dialogText.includes(testData.subjectName)) {
      throw new Error(`Confirmation dialog doesn't mention subject name: ${testData.subjectName}`);
    }
    
    // First test canceling the deletion
    console.log('📝 Step 5: Test canceling deletion');
    await driverManager.clickElement(config.selectors.cancelDelete);
    
    // Verify dialog closes and subject still exists
    await driverManager.waitForElementToDisappear(config.selectors.deleteDialog);
    
    const subjectStillExists = await driverManager.elementExists(config.selectors.subjectCard);
    if (!subjectStillExists) {
      throw new Error('Subject was deleted when cancellation was clicked');
    }
    
    // Now actually delete the subject
    console.log('📝 Step 6: Confirm deletion');
    await deleteButtons[0].click(); // Click delete again
    await driverManager.waitForElement(config.selectors.deleteDialog);
    await driverManager.clickElement(config.selectors.confirmDelete);
    
    // Verify confirmation dialog closes
    await driverManager.waitForElementToDisappear(config.selectors.deleteDialog);
    
    // Verify success notification
    console.log('📝 Step 7: Verify success notification');
    const successNotification = await driverManager.elementExists(config.selectors.successToast);
    if (!successNotification) {
      throw new Error('Success notification not displayed after deletion');
    }
    
    // Verify subject no longer exists in the list
    console.log('📝 Step 8: Verify subject is removed from list');
    await driverManager.driver.sleep(1000); // Wait for list to update
    
    const subjectGone = !await driverManager.elementExists(config.selectors.subjectCard);
    if (!subjectGone) {
      throw new Error('Subject still appears in list after deletion');
    }
    
    // Search should return no results
    const noResultsMessage = await driverManager.elementExists('text*="No subjects found"');
    // Note: This selector might need adjustment based on actual implementation
    
    console.log('✅ Test Case 4 PASSED: Subject deleted successfully with confirmation');
    return { success: true, message: 'Subject deleted successfully with confirmation' };
    
  } catch (error) {
    console.error('❌ Test Case 4 FAILED:', error.message);
    
    // Take screenshot for debugging
    try {
      await driverManager.takeScreenshot('./test-results/delete-subject-failure.png');
    } catch (screenshotError) {
      console.error('Failed to take failure screenshot:', screenshotError);
    }
    
    return { success: false, message: error.message };
  } finally {
    await driverManager.quit();
  }
}

module.exports = testDeleteSubject;