const DriverManager = require('../utils/driver-manager');
const config = require('../config');

/**
 * Test Case 8: Verify subject list pagination
 * 
 * This test verifies that pagination works correctly when there are
 * more subjects than can be displayed on a single page.
 */
async function testPagination() {
  const driverManager = new DriverManager();
  
  try {
    console.log('\n🧪 Test Case 8: Verify subject list pagination');
    console.log('=' .repeat(50));
    
    // Initialize driver and navigate to app
    await driverManager.initializeDriver();
    await driverManager.navigateToApp();
    
    // Create enough subjects to trigger pagination (assuming 9 per page based on grid layout)
    console.log('📝 Step 1: Create multiple subjects to trigger pagination');
    
    const subjectsToCreate = 15; // More than one page worth
    
    for (let i = 1; i <= subjectsToCreate; i++) {
      const subject = {
        ...config.testData.validSubject,
        subjectName: `Pagination Test Subject ${i.toString().padStart(2, '0')}`,
        professor: `Dr. Test Professor ${i}`,
        description: `This is pagination test subject number ${i} created for testing the pagination functionality.`
      };
      
      await driverManager.clickElement(config.selectors.createButton);
      await driverManager.waitForElement(config.selectors.formDialog);
      
      await driverManager.typeText(config.selectors.subjectNameInput, subject.subjectName);
      await driverManager.typeText(config.selectors.creditsInput, subject.credits.toString());
      await driverManager.typeText(config.selectors.professorInput, subject.professor);
      await driverManager.selectDropdownOption(config.selectors.departmentSelect, subject.department);
      await driverManager.typeText(config.selectors.descriptionInput, subject.description);
      
      await driverManager.clickElement(config.selectors.saveButton);
      await driverManager.waitForElementToDisappear(config.selectors.formDialog);
      
      // Add small delay to prevent overwhelming the system
      await driverManager.driver.sleep(200);
      
      // Show progress
      if (i % 5 === 0) {
        console.log(`   Created ${i}/${subjectsToCreate} subjects...`);
      }
    }
    
    // Clear any search filters to see all subjects
    console.log('📝 Step 2: Clear filters to show all subjects');
    await driverManager.typeText(config.selectors.searchInput, '');
    await driverManager.driver.sleep(1000);
    
    // Check if pagination controls appear
    console.log('📝 Step 3: Verify pagination controls appear');
    const paginationExists = await driverManager.elementExists(config.selectors.pageInfo);
    
    if (!paginationExists) {
      // Check if there are enough subjects to require pagination
      const subjectCards = await driverManager.driver.findElements(
        { css: config.selectors.subjectCard }
      );
      
      if (subjectCards.length < 9) {
        throw new Error(`Not enough subjects created for pagination test: ${subjectCards.length}`);
      } else {
        throw new Error('Pagination controls not visible despite having many subjects');
      }
    }
    
    // Verify initial page info
    console.log('📝 Step 4: Verify initial page information');
    const initialPageInfo = await driverManager.getElementText(config.selectors.pageInfo);
    
    if (!initialPageInfo.includes('Page 1')) {
      throw new Error(`Expected 'Page 1' in page info, got: ${initialPageInfo}`);
    }
    
    // Count subjects on first page
    const firstPageSubjects = await driverManager.driver.findElements(
      { css: config.selectors.subjectCard }
    );
    
    console.log(`   Found ${firstPageSubjects.length} subjects on first page`);
    
    // Verify "Previous" button is disabled on first page
    const prevButton = await driverManager.driver.findElement(
      { css: config.selectors.prevPage }
    );
    const prevButtonDisabled = await prevButton.getAttribute('disabled');
    
    if (!prevButtonDisabled) {
      throw new Error('Previous button should be disabled on first page');
    }
    
    // Click "Next" button to go to second page
    console.log('📝 Step 5: Navigate to second page');
    await driverManager.clickElement(config.selectors.nextPage);
    await driverManager.driver.sleep(1000); // Wait for page to load
    
    // Verify page info updated
    const secondPageInfo = await driverManager.getElementText(config.selectors.pageInfo);
    if (!secondPageInfo.includes('Page 2')) {
      throw new Error(`Expected 'Page 2' in page info, got: ${secondPageInfo}`);
    }
    
    // Count subjects on second page
    const secondPageSubjects = await driverManager.driver.findElements(
      { css: config.selectors.subjectCard }
    );
    
    console.log(`   Found ${secondPageSubjects.length} subjects on second page`);
    
    // Verify "Previous" button is now enabled
    const prevButtonEnabledCheck = await prevButton.getAttribute('disabled');
    if (prevButtonEnabledCheck) {
      throw new Error('Previous button should be enabled on second page');
    }
    
    // Test going back to first page
    console.log('📝 Step 6: Navigate back to first page');
    await driverManager.clickElement(config.selectors.prevPage);
    await driverManager.driver.sleep(1000);
    
    // Verify we're back on page 1
    const backToFirstPageInfo = await driverManager.getElementText(config.selectors.pageInfo);
    if (!backToFirstPageInfo.includes('Page 1')) {
      throw new Error(`Expected to be back on 'Page 1', got: ${backToFirstPageInfo}`);
    }
    
    // Test pagination with search filter
    console.log('📝 Step 7: Test pagination with search filter');
    await driverManager.typeText(config.selectors.searchInput, 'Pagination Test');
    await driverManager.driver.sleep(1000);
    
    // Should still show pagination if we have enough matching results
    const filteredPageInfo = await driverManager.elementExists(config.selectors.pageInfo);
    
    // Test edge case: Navigate to last page
    console.log('📝 Step 8: Test navigation to last page');
    
    // Clear search to see all results
    await driverManager.typeText(config.selectors.searchInput, '');
    await driverManager.driver.sleep(1000);
    
    // Extract total pages from page info
    const currentPageInfo = await driverManager.getElementText(config.selectors.pageInfo);
    const totalPagesMatch = currentPageInfo.match(/of (\d+)/);
    
    if (!totalPagesMatch) {
      throw new Error(`Could not extract total pages from: ${currentPageInfo}`);
    }
    
    const totalPages = parseInt(totalPagesMatch[1]);
    console.log(`   Total pages: ${totalPages}`);
    
    // Navigate to last page by clicking next repeatedly
    for (let page = 2; page <= totalPages; page++) {
      await driverManager.clickElement(config.selectors.nextPage);
      await driverManager.driver.sleep(500);
    }
    
    // Verify we're on the last page
    const lastPageInfo = await driverManager.getElementText(config.selectors.pageInfo);
    if (!lastPageInfo.includes(`Page ${totalPages}`)) {
      throw new Error(`Expected to be on page ${totalPages}, got: ${lastPageInfo}`);
    }
    
    // Verify "Next" button is disabled on last page
    const nextButton = await driverManager.driver.findElement(
      { css: config.selectors.nextPage }
    );
    const nextButtonDisabled = await nextButton.getAttribute('disabled');
    
    if (!nextButtonDisabled) {
      throw new Error('Next button should be disabled on last page');
    }
    
    console.log('✅ Test Case 8 PASSED: Pagination functionality working correctly');
    return { success: true, message: 'Pagination functionality working correctly' };
    
  } catch (error) {
    console.error('❌ Test Case 8 FAILED:', error.message);
    
    // Take screenshot for debugging
    try {
      await driverManager.takeScreenshot('./test-results/pagination-failure.png');
    } catch (screenshotError) {
      console.error('Failed to take failure screenshot:', screenshotError);
    }
    
    return { success: false, message: error.message };
  } finally {
    await driverManager.quit();
  }
}

module.exports = testPagination;