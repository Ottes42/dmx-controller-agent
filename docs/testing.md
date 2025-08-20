# 🧪 Testing Guide

This project uses **Jest** for comprehensive unit testing of all backend components.

## 📁 Test Structure

```
tests/
├── setup.js              # Jest setup and custom matchers
├── __mocks__/
│   └── dmx.js            # Mock DMX hardware for isolated testing
├── ParLightB262.test.js  # Device class unit tests
├── api.test.js           # REST API endpoint tests
└── index.test.js         # Server initialization and shutdown tests
```

## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run hardware test script (requires actual DMX hardware)
npm run test:hardware
```

### Test Categories

1. **Unit Tests** (`npm test`) - Fast, isolated tests with mocked dependencies
2. **Hardware Tests** (`npm run test:hardware`) - Integration tests requiring DMX hardware

## 📊 Coverage Report

Current test coverage:

- **Overall Coverage**: ~88% statements, ~57% branches, ~86% functions
- **ParLightB262**: Core device logic with comprehensive method testing
- **API Routes**: All endpoints with error handling and parameter validation
- **Server**: Initialization, startup, and graceful shutdown

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)

```javascript
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: [
    'src/**/*.js',
    'devices/**/*.js',
    '!src/index.js' // Integration-focused, harder to unit test
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
}
```

### Mock Strategy

- **DMX Hardware**: Mocked to enable fast, reliable testing without hardware dependencies
- **Express Components**: Real Express app with mocked ParLightB262 for API tests
- **File System**: No mocking needed, all operations are in-memory for tests

## ✅ What's Tested

### ParLightB262 Device Class
- ✅ Constructor and channel mapping
- ✅ Basic control methods (turnOn/Off, setColor, setRGB, etc.)
- ✅ Color validation and error handling
- ✅ Mode control (manual, hue shifts, sound control)
- ✅ Animation creation and control
- ✅ Connection status checking
- ✅ Private helper methods
- ✅ Method chaining
- ✅ Static utility methods

### API Routes (`src/api.js`)
- ✅ Light control endpoints (`/light/*`)
- ✅ Animation endpoints (`/animation/*`)
- ✅ Info endpoints (`/colors`, `/status`, `/health`)
- ✅ Error handling and status codes
- ✅ Parameter validation and defaults
- ✅ Integration with ParLightB262 methods

### Server Setup (`src/index.js`)
- ✅ Express app initialization
- ✅ DMX universe setup
- ✅ Middleware configuration
- ✅ Route registration
- ✅ Server startup and port handling
- ✅ Graceful shutdown process
- ✅ Signal handling (SIGTERM/SIGINT)
- ✅ Environment variable handling

## 🎯 Test Quality Principles

### No "Lying Tests"
- Tests validate actual business logic, not implementation details
- Realistic error scenarios and edge cases
- Proper mocking that doesn't hide real behavior

### Meaningful Coverage
- Focus on critical paths and error handling
- Test boundary conditions and validation logic
- Verify API contracts and response formats

### Maintainable Tests
- Clear test organization with descriptive names
- Proper setup/teardown to avoid test interdependence
- Consistent mocking strategy across test suites

## 🔍 Test Examples

### Testing Color Validation
```javascript
test('setColor should throw error for invalid color', () => {
  expect(() => {
    parLight.setColor('invalid_color')
  }).toThrow('Unknown color: \'invalid_color\'. Available colors:')
})
```

### Testing API Error Handling
```javascript
test('should handle errors from ParLightB262', async () => {
  mockParLight.turnOn.mockImplementation(() => {
    throw new Error('Invalid color')
  })

  const response = await request(app)
    .post('/api/light/on')
    .send({ color: 'invalid' })
    .expect(400)

  expect(response.body).toEqual({
    success: false,
    error: 'Invalid color'
  })
})
```

### Testing Graceful Shutdown
```javascript
test('should stop animations and turn off light', () => {
  mockParLight.isAnimating.mockReturnValue(true)
  
  gracefulShutdown('SIGTERM')

  expect(mockParLight.stopAnimation).toHaveBeenCalled()
  expect(mockParLight.turnOff).toHaveBeenCalled()
})
```

## 🛠️ Extending Tests

When adding new features:

1. **Add unit tests** for new methods in appropriate test files
2. **Update API tests** if adding new endpoints
3. **Mock new dependencies** in `__mocks__/` if needed
4. **Verify coverage** doesn't drop significantly
5. **Test error conditions** and edge cases

## 📝 Best Practices

- **Write tests first** when fixing bugs (TDD approach)
- **Use descriptive test names** that explain the scenario
- **Group related tests** with `describe` blocks
- **Test both success and failure paths**
- **Keep tests fast** by using proper mocking
- **Avoid testing implementation details** - focus on behavior

This comprehensive test suite ensures reliable, maintainable code while providing confidence for future changes! 🚀✨