const { Builder, Browser, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const config = require('../config');

class DriverManager {
  constructor() {
    this.driver = null;
  }

  /**
   * Initialize WebDriver with configured options
   */
  async initializeDriver() {
    try {
      const chromeOptions = new chrome.Options();
      
      // Add Chrome options from config
      config.chromeOptions.forEach(option => {
        chromeOptions.addArguments(option);
      });
      
      // Set headless mode based on config
      if (config.headless) {
        chromeOptions.addArguments('--headless');
      }
      
      // Build the driver
      this.driver = await new Builder()
        .forBrowser(Browser.CHROME)
        .setChromeOptions(chromeOptions)
        .build();
      
      // Set timeouts
      await this.driver.manage().setTimeouts({
        implicit: config.timeouts.implicit,
        pageLoad: config.timeouts.pageLoad,
        script: config.timeouts.script,
      });
      
      console.log('✅ WebDriver initialized successfully');
      return this.driver;
    } catch (error) {
      console.error('❌ Failed to initialize WebDriver:', error);
      throw error;
    }
  }

  /**
   * Navigate to the application URL
   */
  async navigateToApp() {
    if (!this.driver) {
      throw new Error('Driver not initialized');
    }
    
    try {
      await this.driver.get(config.baseUrl);
      console.log(`✅ Navigated to ${config.baseUrl}`);
    } catch (error) {
      console.error('❌ Failed to navigate to app:', error);
      throw error;
    }
  }

  /**
   * Wait for element to be present and visible
   */
  async waitForElement(selector, timeout = config.timeouts.element) {
    if (!this.driver) {
      throw new Error('Driver not initialized');
    }
    
    try {
      const element = await this.driver.wait(
        until.elementLocated(By.css(selector)),
        timeout
      );
      await this.driver.wait(
        until.elementIsVisible(element),
        timeout
      );
      return element;
    } catch (error) {
      console.error(`❌ Element not found: ${selector}`, error);
      throw error;
    }
  }

  /**
   * Wait for element to be clickable
   */
  async waitForClickableElement(selector, timeout = config.timeouts.element) {
    if (!this.driver) {
      throw new Error('Driver not initialized');
    }
    
    try {
      const element = await this.waitForElement(selector, timeout);
      await this.driver.wait(
        until.elementIsEnabled(element),
        timeout
      );
      return element;
    } catch (error) {
      console.error(`❌ Element not clickable: ${selector}`, error);
      throw error;
    }
  }

  /**
   * Click element with retry logic
   */
  async clickElement(selector, timeout = config.timeouts.element) {
    const element = await this.waitForClickableElement(selector, timeout);
    
    try {
      await element.click();
    } catch (error) {
      // Retry with JavaScript click if regular click fails
      await this.driver.executeScript('arguments[0].click();', element);
    }
  }

  /**
   * Type text into input field
   */
  async typeText(selector, text, clearFirst = true) {
    const element = await this.waitForElement(selector);
    
    if (clearFirst) {
      await element.clear();
    }
    
    await element.sendKeys(text);
  }

  /**
   * Select option from dropdown
   */
  async selectDropdownOption(dropdownSelector, optionText) {
    // Click dropdown to open it
    await this.clickElement(dropdownSelector);
    
    // Wait for dropdown options to appear
    await this.driver.sleep(500);
    
    // Find and click the option
    const optionSelector = `[role="option"]:contains("${optionText}")`;
    try {
      await this.clickElement(optionSelector);
    } catch (error) {
      // Alternative selector for Radix UI dropdowns
      const alternativeSelector = `[data-value="${optionText}"]`;
      await this.clickElement(alternativeSelector);
    }
  }

  /**
   * Get element text
   */
  async getElementText(selector) {
    const element = await this.waitForElement(selector);
    return await element.getText();
  }

  /**
   * Check if element exists
   */
  async elementExists(selector, timeout = 2000) {
    try {
      await this.driver.wait(
        until.elementLocated(By.css(selector)),
        timeout
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Wait for element to disappear
   */
  async waitForElementToDisappear(selector, timeout = config.timeouts.element) {
    try {
      await this.driver.wait(
        until.stalenessOf(await this.driver.findElement(By.css(selector))),
        timeout
      );
    } catch (error) {
      // Element might not exist, which is also a valid state
      console.log(`Element ${selector} not found or already disappeared`);
    }
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(filename) {
    if (!this.driver) {
      throw new Error('Driver not initialized');
    }
    
    try {
      const screenshot = await this.driver.takeScreenshot();
      require('fs').writeFileSync(filename, screenshot, 'base64');
      console.log(`📸 Screenshot saved: ${filename}`);
    } catch (error) {
      console.error('❌ Failed to take screenshot:', error);
    }
  }

  /**
   * Execute JavaScript in browser
   */
  async executeScript(script, ...args) {
    if (!this.driver) {
      throw new Error('Driver not initialized');
    }
    
    return await this.driver.executeScript(script, ...args);
  }

  /**
   * Refresh the page
   */
  async refresh() {
    if (!this.driver) {
      throw new Error('Driver not initialized');
    }
    
    await this.driver.navigate().refresh();
    console.log('🔄 Page refreshed');
  }

  /**
   * Clean up and quit driver
   */
  async quit() {
    if (this.driver) {
      try {
        await this.driver.quit();
        console.log('✅ WebDriver closed successfully');
      } catch (error) {
        console.error('❌ Error closing WebDriver:', error);
      }
      this.driver = null;
    }
  }
}

module.exports = DriverManager;