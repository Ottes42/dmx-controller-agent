// Test setup file for Jest
// Global test configuration and setup

// Set NODE_ENV to test to avoid dotenv conflicts
process.env.NODE_ENV = 'test'

// Suppress console logs during tests unless explicitly needed
const originalConsole = console
global.console = {
  ...originalConsole,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}

// Add custom matchers if needed
expect.extend({
  toBeWithinRange (received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true
      }
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false
      }
    }
  }
})