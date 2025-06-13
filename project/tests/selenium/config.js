// Selenium WebDriver configuration
module.exports = {
  // Test environment settings
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000',
  
  // Browser configuration
  browser: 'chrome',
  headless: process.env.HEADLESS !== 'false',
  
  // Test timeouts (in milliseconds)
  timeouts: {
    implicit: 10000,        // Time to wait for elements to appear
    pageLoad: 30000,        // Time to wait for page loads
    script: 30000,          // Time to wait for scripts to execute
    element: 5000,          // Time to wait for element interactions
  },
  
  // Chrome options
  chromeOptions: [
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--window-size=1920,1080',
    '--disable-extensions',
    '--disable-web-security',
    '--allow-running-insecure-content',
  ],
  
  // Test data
  testData: {
    validSubject: {
      subjectName: 'Test Subject for Automation',
      credits: 4,
      professor: 'Dr. Test Professor',
      department: 'Computer Science',
      description: 'This is a comprehensive test subject created for automation testing purposes. It covers various aspects of the testing framework.',
    },
    invalidSubject: {
      subjectName: 'A', // Too short
      credits: 15,      // Too high
      professor: '',    // Empty
      department: '',   // Empty
      description: 'Short', // Too short
    },
    updatedSubject: {
      subjectName: 'Updated Test Subject',
      credits: 3,
      professor: 'Dr. Updated Professor',
      department: 'Mathematics',
      description: 'This subject has been updated through automation testing to verify the edit functionality works correctly.',
    },
  },
  
  // Selectors for UI elements
  selectors: {
    // Navigation and layout
    createButton: '[data-testid="create-subject-btn"]',
    searchInput: '[data-testid="search-input"]',
    departmentFilter: '[data-testid="department-filter"]',
    pageInfo: '[data-testid="page-info"]',
    prevPage: '[data-testid="prev-page"]',
    nextPage: '[data-testid="next-page"]',
    
    // Subject cards and list
    subjectCard: '[data-testid^="subject-card-"]',
    subjectName: '[data-testid="subject-name"]',
    subjectProfessor: '[data-testid="subject-professor"]',
    subjectDescription: '[data-testid="subject-description"]',
    editButton: '[data-testid^="edit-subject-"]',
    deleteButton: '[data-testid^="delete-subject-"]',
    
    // Form elements
    formDialog: '[data-testid="subject-form-dialog"]',
    subjectNameInput: '[data-testid="subject-name-input"]',
    creditsInput: '[data-testid="credits-input"]',
    professorInput: '[data-testid="professor-input"]',
    departmentSelect: '[data-testid="department-select"]',
    descriptionInput: '[data-testid="description-input"]',
    saveButton: '[data-testid="save-button"]',
    cancelButton: '[data-testid="cancel-button"]',
    
    // Delete confirmation
    deleteDialog: '[data-testid="delete-confirmation-dialog"]',
    confirmDelete: '[data-testid="confirm-delete"]',
    cancelDelete: '[data-testid="cancel-delete"]',
    
    // Notifications
    successToast: '.sonner-toast[data-type="success"]',
    errorToast: '.sonner-toast[data-type="error"]',
    
    // Form validation errors
    fieldError: '.text-destructive',
  },
};