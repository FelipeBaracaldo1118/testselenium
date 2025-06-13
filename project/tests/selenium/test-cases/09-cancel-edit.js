const DriverManager = require('../utils/driver-manager');
const config = require('../config');

/**
 * Test Case 9: Cancel edit operation
 * 
 * This test verifies that users can cancel an edit operation and
 * that no changes are saved when the edit is canceled.
 */
async function testCancelEdit() {
  const driverManager = new DriverManager();
  
  try {
    console.log('\n🧪 Test Case 9: Cancel edit operation');
    console.log('=' .repeat(50));
    
    // Initialize driver and navigate to app
    await driverManager.initializeDriver();
    await driverManager.navigateToApp();
    
    // Create a subject to edit
    console.log('📝 Step 1: Create a subject to edit');
    await driverManager.clickElement(config.selectors.createButton);
    await driverManager.waitForElement(config.selectors.formDialog);
    
    const originalData = {
      ...config.testData.validSubject,
      subjectName: 'Cancel Edit Test Subject',
      professor: 'Dr. Original Professor'
    };
    
    await driverManager.typeText(config.selectors.subjectNameInput, originalData.subjectName);
    await driverManager.typeText(config.selectors.creditsInput, originalData.credits.toString());
    await driverManager.typeText(config.selectors.professorInput, originalData.professor);
    await driverManager.selectDropdownOption(config.selectors.depart mentSelect, originalData.department);
    await driverManager.typeText(config.selectors.descriptionInput, originalData.description);
    
    await driverManager.clickElement(config.selectors.saveButton);
    await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    
    // Search for the created subject
    await driverManager.typeText(config.selectors.searchInput, originalData.subjectName);
    await driverManager.driver.sleep(1000);
    
    // Verify original data is displayed
    console.log('📝 Step 2: Verify original data before edit');
    const originalDisplayedName = await driverManager.getElementText(config.selectors.subjectName);
    const originalDisplayedProfessor = await driverManager.getElementText(config.selectors.subjectProfessor);
    
    if (!originalDisplayedName.includes(originalData.subjectName)) {
      throw new Error(`Original subject name not found: ${originalDisplayedName}`);
    }
    
    if (!originalDisplayedProfessor.includes(originalData.professor)) {
      throw new Error(`Original professor name not found: ${originalDisplayedProfessor}`);
    }
    
    // Click edit button
    console.log('📝 Step 3: Open edit form');
    const editButtons = await driverManager.driver.findElements(
      { css: '[data-testid^="edit-subject-"]' }
    );
    
    if (editButtons.length === 0) {
      throw new Error('No edit button found');
    }
    
    await editButtons[0].click();
    await driverManager.waitForElement(config.selectors.formDialog);
    
    // Verify form is populated with existing data
    console.log('📝 Step 4: Verify form is populated with existing data');
    const nameInputValue = await driverManager.driver.findElement(
      { css: config.selectors.subjectNameInput }
    ).getAttribute('value');
    
    if (nameInputValue !== originalData.subjectName) {
      throw new Error(`Form not populated correctly: expected "${originalData.subjectName}", got "${nameInputValue}"`);
    }
    
    // Make changes to the form
    console.log('📝 Step 5: Make changes to the form');
    const modifiedData = {
      subjectName: 'Modified Subject Name - Should Not Save',
      professor: 'Dr. Modified Professor - Should Not Save',
      credits: 5,
      description: 'This modified description should not be saved when we cancel the edit operation.'
    };
    
    await driverManager.typeText(config.selectors.subjectNameInput, modifiedData.subjectName);
    await driverManager.typeText(config.selectors.creditsInput, modifiedData.credits.toString());
    await driverManager.typeText(config.selectors.professorInput, modifiedData.professor);
    await driverManager.typeText(config.selectors.descriptionInput, modifiedData.description);
    
    // Verify changes are reflected in the form
    const modifiedNameValue = await driverManager.driver.findElement(
      { css: config.selectors.subjectNameInput }
    ).getAttribute('value');
    
    if (modifiedNameValue !== modifiedData.subjectName) {
      throw new Error(`Form changes not reflected: expected "${modifiedData.subjectName}", got "${modifiedNameValue}"`);
    }
    
    // Cancel the edit operation
    console.log('📝 Step 6: Cancel the edit operation');
    await driverManager.clickElement(config.selectors.cancelButton);
    
    // Verify form closes
    await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    
    // Verify no success notification appears
    console.log('📝 Step 7: Verify no success notification appears');
    const successNotification = await driverManager.elementExists(config.selectors.successToast, 2000);
    if (successNotification) {
      throw new Error('Success notification appeared after canceling edit');
    }
    
    // Refresh the page to ensure we see the latest data
    console.log('📝 Step 8: Refresh page and verify original data is preserved');
    await driverManager.refresh();
    await driverManager.driver.sleep(2000); // Wait for page to load
    
    // Search for the subject again
    await driverManager.typeText(config.selectors.searchInput, originalData.subjectName);
    await driverManager.driver.sleep(1000);
    
    // Verify original data is still displayed (changes were not saved)
    const finalDisplayedName = await driverManager.getElementText(config.selectors.subjectName);
    const finalDisplayedProfessor = await driverManager.getElementText(config.selectors.subjectProfessor);
    
    if (!finalDisplayedName.includes(originalData.subjectName)) {
      throw new Error(`Original subject name not preserved after cancel: ${finalDisplayedName}`);
    }
    
    if (!finalDisplayedProfessor.includes(originalData.professor)) {
      throw new Error(`Original professor name not preserved after cancel: ${finalDisplayedProfessor}`);
    }
    
    // Verify modified data is NOT displayed
    if (finalDisplayedName.includes(modifiedData.subjectName)) {
      throw new Error(`Modified subject name was saved despite cancel: ${finalDisplayedName}`);
    }
    
    if (finalDisplayedProfessor.includes(modifiedData.professor)) {
      throw new Error(`Modified professor name was saved despite cancel: ${finalDisplayedProfessor}`);
    }
    
    // Test canceling with unsaved changes warning (if implemented)
    console.log('📝 Step 9: Test cancel with unsaved changes');
    
    // Open edit form again
    const editButtonsAgain = await driverManager.driver.findElements(
      { css: '[data-testid^="edit-subject-"]' }
    );
    await editButtonsAgain[0].click();
    await driverManager.waitForElement(config.selectors.formDialog);
    
    // Make a small change
    await driverManager.typeText(config.selectors.subjectNameInput, originalData.subjectName + ' - Small Change');
    
    // Try to cancel
    await driverManager.clickElement(config.selectors.cancelButton);
    
    // Form should close (or show confirmation dialog if implemented)
    await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    
    // Test using Escape key to cancel (if supported)
    console.log('📝 Step 10: Test canceling with Escape key');
    
    // Open edit form one more time
    const editButtonsFinal = await driverManager.driver.findElements(
      { css: '[data-testid^="edit-subject-"]' }
    );
    await editButtonsFinal[0].click();
    await driverManager.waitForElement(config.selectors.formDialog);
    
    // Press Escape key
    const formDialog = await driverManager.driver.findElement(
      { css: config.selectors.formDialog }
    );
    await formDialog.sendKeys(driverManager.driver.Key?.ESCAPE || '\uE00C');
    
    // Form should close
    await driverManager.driver.sleep(1000);
    const formStillOpen = await driverManager.elementExists(config.selectors.formDialog, 1000);
    
    // Note: Escape key functionality might not be implemented, so we don't fail the test for this
    if (formStillOpen) {
      console.log('   ℹ️  Escape key cancel not implemented - clicking cancel button instead');
      await driverManager.clickElement(config.selectors.cancelButton);
      await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    }
    
    console.log('✅ Test Case 9 PASSED: Cancel edit operation working correctly');
    return { success: true, message: 'Cancel edit operation working correctly' };
    
  } catch (error) {
    console.error('❌ Test Case 9 FAILED:', error.message);
    
    // Take screenshot for debugging
    try {
      await driverManager.takeScreenshot('./test-results/cancel-edit-failure.png');
    } catch (screenshotError) {
      console.error('Failed to take failure screenshot:', screenshotError);
    }
    
    return { success: false, message: error.message };
  } finally {
    await driverManager.quit();
  }
}

module.exports = testCancelEdit;