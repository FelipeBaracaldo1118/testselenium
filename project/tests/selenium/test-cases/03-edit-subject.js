const DriverManager = require('../utils/driver-manager');
const config = require('../config');

/**
 * Test Case 3: Edit existing subject
 * 
 * This test verifies that users can successfully edit an existing subject
 * and see the changes reflected in the subject list.
 */
async function testEditSubject() {
  const driverManager = new DriverManager();
  
  try {
    console.log('\n🧪 Test Case 3: Edit existing subject');
    console.log('=' .repeat(50));
    
    // Initialize driver and navigate to app
    await driverManager.initializeDriver();
    await driverManager.navigateToApp();
    
    // First, create a subject to edit (reuse creation logic)
    console.log('📝 Step 1: Create a subject to edit');
    await driverManager.clickElement(config.selectors.createButton);
    await driverManager.waitForElement(config.selectors.formDialog);
    
    const originalData = config.testData.validSubject;
    await driverManager.typeText(config.selectors.subjectNameInput, originalData.subjectName);
    await driverManager.typeText(config.selectors.creditsInput, originalData.credits.toString());
    await driverManager.typeText(config.selectors.professorInput, originalData.professor);
    await driverManager.selectDropdownOption(config.selectors.departmentSelect, originalData.department);
    await driverManager.typeText(config.selectors.descriptionInput, originalData.description);
    
    await driverManager.clickElement(config.selectors.saveButton);
    await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    
    // Search for the created subject
    await driverManager.typeText(config.selectors.searchInput, originalData.subjectName);
    await driverManager.driver.sleep(1000);
    
    // Click edit button on the first subject card
    console.log('📝 Step 2: Click edit button on subject');
    const editButtonSelector = `${config.selectors.subjectCard} ${config.selectors.editButton.replace(/\[\^=".*"\]/, '')}`;
    
    // Wait for subject card to appear and find edit button
    await driverManager.waitForElement(config.selectors.subjectCard);
    
    // Use a more specific selector for the edit button within the subject card
    const editButtons = await driverManager.driver.findElements(
      { css: '[data-testid^="edit-subject-"]' }
    );
    
    if (editButtons.length === 0) {
      throw new Error('No edit button found');
    }
    
    await editButtons[0].click();
    
    // Verify form opens with existing data
    console.log('📝 Step 3: Verify form opens with existing data');
    await driverManager.waitForElement(config.selectors.formDialog);
    
    // Verify form is populated with existing data
    const nameInputValue = await driverManager.driver.findElement(
      { css: config.selectors.subjectNameInput }
    ).getAttribute('value');
    
    if (nameInputValue !== originalData.subjectName) {
      throw new Error(`Form not populated correctly: expected "${originalData.subjectName}", got "${nameInputValue}"`);
    }
    
    // Update the subject with new data
    console.log('📝 Step 4: Update subject with new data');
    const updatedData = config.testData.updatedSubject;
    
    await driverManager.typeText(config.selectors.subjectNameInput, updatedData.subjectName);
    await driverManager.typeText(config.selectors.creditsInput, updatedData.credits.toString());
    await driverManager.typeText(config.selectors.professorInput, updatedData.professor);
    await driverManager.selectDropdownOption(config.selectors.departmentSelect, updatedData.department);
    await driverManager.typeText(config.selectors.descriptionInput, updatedData.description);
    
    // Submit the updated form
    console.log('📝 Step 5: Submit updated form');
    await driverManager.clickElement(config.selectors.saveButton);
    
    // Wait for form to close
    await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    
    // Verify success notification
    console.log('📝 Step 6: Verify success notification');
    const successNotification = await driverManager.elementExists(config.selectors.successToast);
    if (!successNotification) {
      throw new Error('Success notification not displayed after edit');
    }
    
    // Clear search and search for updated subject
    console.log('📝 Step 7: Search for updated subject');
    await driverManager.typeText(config.selectors.searchInput, updatedData.subjectName);
    await driverManager.driver.sleep(1000);
    
    // Verify updated subject appears with new data
    console.log('📝 Step 8: Verify updated data is displayed');
    const subjectExists = await driverManager.elementExists(config.selectors.subjectCard);
    if (!subjectExists) {
      throw new Error('Updated subject not found in the list');
    }
    
    const displayedName = await driverManager.getElementText(config.selectors.subjectName);
    const displayedProfessor = await driverManager.getElementText(config.selectors.subjectProfessor);
    
    if (!displayedName.includes(updatedData.subjectName)) {
      throw new Error(`Updated subject name not displayed: expected "${updatedData.subjectName}", found "${displayedName}"`);
    }
    
    if (!displayedProfessor.includes(updatedData.professor)) {
      throw new Error(`Updated professor name not displayed: expected "${updatedData.professor}", found "${displayedProfessor}"`);
    }
    
    console.log('✅ Test Case 3 PASSED: Subject edited successfully');
    return { success: true, message: 'Subject edited successfully' };
    
  } catch (error) {
    console.error('❌ Test Case 3 FAILED:', error.message);
    
    // Take screenshot for debugging
    try {
      await driverManager.takeScreenshot('./test-results/edit-subject-failure.png');
    } catch (screenshotError) {
      console.error('Failed to take failure screenshot:', screenshotError);
    }
    
    return { success: false, message: error.message };
  } finally {
    await driverManager.quit();
  }
}

module.exports = testEditSubject;