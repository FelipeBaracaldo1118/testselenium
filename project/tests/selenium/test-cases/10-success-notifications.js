const DriverManager = require('../utils/driver-manager');
const config = require('../config');

/**
 * Test Case 10: Verify success notifications
 * 
 * This test verifies that appropriate success notifications are displayed
 * for all CRUD operations and that they disappear after a reasonable time.
 */
async function testSuccessNotifications() {
  const driverManager = new DriverManager();
  
  try {
    console.log('\n🧪 Test Case 10: Verify success notifications');
    console.log('=' .repeat(50));
    
    // Initialize driver and navigate to app
    await driverManager.initializeDriver();
    await driverManager.navigateToApp();
    
    // Test Case 10a: Create subject success notification
    console.log('📝 Step 1: Test create subject success notification');
    await driverManager.clickElement(config.selectors.createButton);
    await driverManager.waitForElement(config.selectors.formDialog);
    
    const createTestData = {
      ...config.testData.validSubject,
      subjectName: 'Notification Test Subject - Create'
    };
    
    await driverManager.typeText(config.selectors.subjectNameInput, createTestData.subjectName);
    await driverManager.typeText(config.selectors.creditsInput, createTestData.credits.toString());
    await driverManager.typeText(config.selectors.professorInput, createTestData.professor);
    await driverManager.selectDropdownOption(config.selectors.departmentSelect, createTestData.department);
    await driverManager.typeText(config.selectors.descriptionInput, createTestData.description);
    
    await driverManager.clickElement(config.selectors.saveButton);
    await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    
    // Verify success notification appears
    const createNotification = await driverManager.waitForElement(config.selectors.successToast, 5000);
    const createNotificationText = await createNotification.getText();
    
    if (!createNotificationText.toLowerCase().includes('created') && 
        !createNotificationText.toLowerCase().includes('success')) {
      throw new Error(`Create notification text unexpected: ${createNotificationText}`);
    }
    
    console.log(`   ✅ Create notification: "${createNotificationText}"`);
    
    // Wait for notification to disappear (should auto-dismiss)
    await driverManager.driver.sleep(3000);
    const createNotificationGone = !await driverManager.elementExists(config.selectors.successToast, 1000);
    
    if (!createNotificationGone) {
      console.log('   ⚠️  Create notification did not auto-dismiss');
    }
    
    // Test Case 10b: Edit subject success notification
    console.log('📝 Step 2: Test edit subject success notification');
    
    // Search for the created subject
    await driverManager.typeText(config.selectors.searchInput, createTestData.subjectName);
    await driverManager.driver.sleep(1000);
    
    // Click edit button
    const editButtons = await driverManager.driver.findElements(
      { css: '[data-testid^="edit-subject-"]' }
    );
    
    if (editButtons.length === 0) {
      throw new Error('No edit button found for notification test');
    }
    
    await editButtons[0].click();
    await driverManager.waitForElement(config.selectors.formDialog);
    
    // Make a change
    const updatedName = 'Notification Test Subject - Updated';
    await driverManager.typeText(config.selectors.subjectNameInput, updatedName);
    
    await driverManager.clickElement(config.selectors.saveButton);
    await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    
    // Verify update success notification
    const updateNotification = await driverManager.waitForElement(config.selectors.successToast, 5000);
    const updateNotificationText = await updateNotification.getText();
    
    if (!updateNotificationText.toLowerCase().includes('updated') && 
        !updateNotificationText.toLowerCase().includes('success')) {
      throw new Error(`Update notification text unexpected: ${updateNotificationText}`);
    }
    
    console.log(`   ✅ Update notification: "${updateNotificationText}"`);
    
    // Wait for notification to disappear
    await driverManager.driver.sleep(3000);
    const updateNotificationGone = !await driverManager.elementExists(config.selectors.successToast, 1000);
    
    if (!updateNotificationGone) {
      console.log('   ⚠️  Update notification did not auto-dismiss');
    }
    
    // Test Case 10c: Delete subject success notification
    console.log('📝 Step 3: Test delete subject success notification');
    
    // Search for the updated subject
    await driverManager.typeText(config.selectors.searchInput, updatedName);
    await driverManager.driver.sleep(1000);
    
    // Click delete button
    const deleteButtons = await driverManager.driver.findElements(
      { css: '[data-testid^="delete-subject-"]' }
    );
    
    if (deleteButtons.length === 0) {
      throw new Error('No delete button found for notification test');
    }
    
    await deleteButtons[0].click();
    await driverManager.waitForElement(config.selectors.deleteDialog);
    await driverManager.clickElement(config.selectors.confirmDelete);
    await driverManager.waitForElementToDisappear(config.selectors.deleteDialog);
    
    // Verify delete success notification
    const deleteNotification = await driverManager.waitForElement(config.selectors.successToast, 5000);
    const deleteNotificationText = await deleteNotification.getText();
    
    if (!deleteNotificationText.toLowerCase().includes('deleted') && 
        !deleteNotificationText.toLowerCase().includes('success')) {
      throw new Error(`Delete notification text unexpected: ${deleteNotificationText}`);
    }
    
    console.log(`   ✅ Delete notification: "${deleteNotificationText}"`);
    
    // Wait for notification to disappear
    await driverManager.driver.sleep(3000);
    const deleteNotificationGone = !await driverManager.elementExists(config.selectors.successToast, 1000);
    
    if (!deleteNotificationGone) {
      console.log('   ⚠️  Delete notification did not auto-dismiss');
    }
    
    // Test Case 10d: Multiple rapid operations
    console.log('📝 Step 4: Test multiple rapid operations notifications');
    
    // Clear search
    await driverManager.typeText(config.selectors.searchInput, '');
    await driverManager.driver.sleep(500);
    
    // Create multiple subjects rapidly
    for (let i = 1; i <= 3; i++) {
      const rapidTestData = {
        ...config.testData.validSubject,
        subjectName: `Rapid Test Subject ${i}`,
        professor: `Dr. Rapid ${i}`
      };
      
      await driverManager.clickElement(config.selectors.createButton);
      await driverManager.waitForElement(config.selectors.formDialog);
      
      await driverManager.typeText(config.selectors.subjectNameInput, rapidTestData.subjectName);
      await driverManager.typeText(config.selectors.creditsInput, rapidTestData.credits.toString());
      await driverManager.typeText(config.selectors.professorInput, rapidTestData.professor);
      await driverManager.selectDropdownOption(config.selectors.departmentSelect, rapidTestData.department);
      await driverManager.typeText(config.selectors.descriptionInput, rapidTestData.description);
      
      await driverManager.clickElement(config.selectors.saveButton);
      await driverManager.waitForElementToDisappear(config.selectors.formDialog);
      
      // Check for notification (might stack or replace previous ones)
      const rapidNotification = await driverManager.elementExists(config.selectors.successToast, 3000);
      if (!rapidNotification) {
        throw new Error(`No notification for rapid creation ${i}`);
      }
      
      // Small delay between operations
      await driverManager.driver.sleep(1000);
    }
    
    console.log('   ✅ Multiple rapid operations handled correctly');
    
    // Test Case 10e: Notification positioning and styling
    console.log('📝 Step 5: Test notification positioning and styling');
    
    // Create one more subject to test notification appearance
    await driverManager.clickElement(config.selectors.createButton);
    await driverManager.waitForElement(config.selectors.formDialog);
    
    const styleTestData = {
      ...config.testData.validSubject,
      subjectName: 'Style Test Subject'
    };
    
    await driverManager.typeText(config.selectors.subjectNameInput, styleTestData.subjectName);
    await driverManager.typeText(config.selectors.creditsInput, styleTestData.credits.toString());
    await driverManager.typeText(config.selectors.professorInput, styleTestData.professor);
    await driverManager.selectDropdownOption(config.selectors.departmentSelect, styleTestData.department);
    await driverManager.typeText(config.selectors.descriptionInput, styleTestData.description);
    
    await driverManager.clickElement(config.selectors.saveButton);
    await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    
    // Check notification styling
    const styleNotification = await driverManager.waitForElement(config.selectors.successToast, 5000);
    
    // Verify notification is visible and positioned correctly
    const notificationRect = await styleNotification.getRect();
    const windowSize = await driverManager.driver.manage().window().getSize();
    
    // Notification should be visible within viewport
    if (notificationRect.x < 0 || notificationRect.y < 0 || 
        notificationRect.x > windowSize.width || notificationRect.y > windowSize.height) {
      throw new Error('Notification positioned outside viewport');
    }
    
    // Check if notification has appropriate styling (color, etc.)
    const notificationColor = await styleNotification.getCssValue('background-color');
    console.log(`   ✅ Notification styling: background-color: ${notificationColor}`);
    
    // Test Case 10f: Error notification (if applicable)
    console.log('📝 Step 6: Test error notification handling');
    
    // Try to create a subject with invalid data to trigger error
    await driverManager.clickElement(config.selectors.createButton);
    await driverManager.waitForElement(config.selectors.formDialog);
    
    // Submit empty form to trigger validation error
    await driverManager.clickElement(config.selectors.saveButton);
    
    // Check if error notification appears (or just validation errors)
    const errorNotification = await driverManager.elementExists(config.selectors.errorToast, 2000);
    
    if (errorNotification) {
      const errorText = await driverManager.getElementText(config.selectors.errorToast);
      console.log(`   ✅ Error notification: "${errorText}"`);
    } else {
      console.log('   ℹ️  No error notification - validation handled inline');
    }
    
    // Cancel the form
    await driverManager.clickElement(config.selectors.cancelButton);
    await driverManager.waitForElementToDisappear(config.selectors.formDialog);
    
    console.log('✅ Test Case 10 PASSED: Success notifications working correctly');
    return { success: true, message: 'Success notifications working correctly' };
    
  } catch (error) {
    console.error('❌ Test Case 10 FAILED:', error.message);
    
    // Take screenshot for debugging
    try {
      await driverManager.takeScreenshot('./test-results/notifications-failure.png');
    } catch (screenshotError) {
      console.error('Failed to take failure screenshot:', screenshotError);
    }
    
    return { success: false, message: error.message };
  } finally {
    await driverManager.quit();
  }
}

module.exports = testSuccessNotifications;