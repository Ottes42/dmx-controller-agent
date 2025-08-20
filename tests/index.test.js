const express = require('express')
const path = require('path')

// Mock all external dependencies before requiring the main module
jest.mock('dmx')
jest.mock('../devices/ParLightB262')
jest.mock('../src/api')

describe('Server Index', () => {
  let mockServer
  let mockDMX
  let mockUniverse
  let mockParLight
  let mockCreateAPIRoutes
  let mockApp
  let originalConsole
  let originalProcessOn
  let originalProcessExit
  let originalSetTimeout

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks()

    // Mock console to capture output
    originalConsole = console
    console.log = jest.fn()
    console.error = jest.fn()

    // Mock process methods
    originalProcessOn = process.on
    originalProcessExit = process.exit
    originalSetTimeout = global.setTimeout

    process.on = jest.fn()
    process.exit = jest.fn()
    global.setTimeout = jest.fn((callback, delay) => {
      // Execute callback immediately for testing
      if (typeof callback === 'function') {
        callback()
      }
      return 'mock-timeout-id'
    })

    // Mock server
    mockServer = {
      listen: jest.fn((port, callback) => {
        if (callback) callback()
        return mockServer
      }),
      close: jest.fn((callback) => {
        if (callback) callback()
      })
    }

    // Mock Express app
    mockApp = {
      use: jest.fn(),
      get: jest.fn(),
      listen: jest.fn(() => mockServer)
    }

    // Mock express
    jest.doMock('express', () => {
      const expressFn = jest.fn(() => mockApp)
      expressFn.json = jest.fn(() => 'json-middleware')
      expressFn.static = jest.fn(() => 'static-middleware')
      return expressFn
    })

    // Mock DMX
    mockUniverse = {
      update: jest.fn(),
      get: jest.fn(() => 128)
    }

    mockDMX = jest.fn(() => ({
      addUniverse: jest.fn(() => mockUniverse)
    }))
    jest.doMock('dmx', () => mockDMX)

    // Mock ParLightB262
    mockParLight = {
      isAnimating: jest.fn(() => false),
      stopAnimation: jest.fn(),
      turnOff: jest.fn()
    }
    jest.doMock('../devices/ParLightB262', () => jest.fn(() => mockParLight))

    // Mock API routes
    mockCreateAPIRoutes = jest.fn(() => 'api-router')
    jest.doMock('../src/api', () => mockCreateAPIRoutes)

    // Mock path module
    jest.doMock('path', () => ({
      join: jest.fn((...args) => args.join('/')),
    }))
  })

  afterEach(() => {
    // Restore original functions
    console.log = originalConsole.log
    console.error = originalConsole.error
    process.on = originalProcessOn
    process.exit = originalProcessExit
    global.setTimeout = originalSetTimeout

    // Clear all mocks and reset modules
    jest.resetModules()
    jest.clearAllMocks()
  })

  describe('Server Initialization', () => {
    test('should initialize Express app with correct middleware', () => {
      // Import after mocks are set up
      require('../src/index')

      expect(mockApp.use).toHaveBeenCalledWith('json-middleware')
      expect(mockApp.use).toHaveBeenCalledWith('static-middleware')
      expect(mockApp.use).toHaveBeenCalledWith('/api', 'api-router')
    })

    test('should set up DMX universe with correct parameters', () => {
      // Set environment variable
      process.env.DMX_DEVICE = '/dev/ttyUSB0'
      
      require('../src/index')

      expect(mockDMX).toHaveBeenCalled()
      const dmxInstance = mockDMX.mock.results[0].value
      expect(dmxInstance.addUniverse).toHaveBeenCalledWith('ottes', 'enttec-open-usb-dmx', '/dev/ttyUSB0')
    })

    test('should use default DMX device when env var not set', () => {
      delete process.env.DMX_DEVICE
      
      require('../src/index')

      const dmxInstance = mockDMX.mock.results[0].value
      expect(dmxInstance.addUniverse).toHaveBeenCalledWith('ottes', 'enttec-open-usb-dmx', 'COM5')
    })

    test('should initialize ParLightB262 with universe and start channel 1', () => {
      const ParLightB262 = require('../devices/ParLightB262')
      
      require('../src/index')

      expect(ParLightB262).toHaveBeenCalledWith(mockUniverse, 1)
    })

    test('should create API routes with ParLightB262 instance', () => {
      require('../src/index')

      expect(mockCreateAPIRoutes).toHaveBeenCalledWith(mockParLight)
    })

    test('should set up static file serving', () => {
      const express = require('express')
      const path = require('path')

      require('../src/index')

      expect(express.static).toHaveBeenCalled()
      expect(path.join).toHaveBeenCalledWith(expect.any(String), '..', 'public')
    })

    test('should set up root route to serve index.html', () => {
      const path = require('path')

      require('../src/index')

      expect(mockApp.get).toHaveBeenCalledWith('/', expect.any(Function))
      
      // Test the route handler
      const routeHandler = mockApp.get.mock.calls.find(call => call[0] === '/')[1]
      const mockRes = { sendFile: jest.fn() }
      routeHandler({}, mockRes)
      
      expect(mockRes.sendFile).toHaveBeenCalled()
      expect(path.join).toHaveBeenCalledWith(expect.any(String), '..', 'public', 'index.html')
    })
  })

  describe('Server Startup', () => {
    test('should start server on default port 3000', () => {
      delete process.env.PORT
      
      require('../src/index')

      expect(mockApp.listen).toHaveBeenCalledWith(3000, expect.any(Function))
    })

    test('should start server on environment PORT', () => {
      process.env.PORT = '8080'
      
      require('../src/index')

      expect(mockApp.listen).toHaveBeenCalledWith('8080', expect.any(Function))
    })

    test('should log startup messages', () => {
      process.env.PORT = '4000'
      process.env.DMX_DEVICE = '/dev/ttyUSB1'
      
      // Clear previous calls before requiring
      console.log.mockClear()
      
      // Make sure listen callback is called synchronously in the mock
      mockApp.listen.mockImplementation((port, callback) => {
        if (callback) callback() // Call the callback synchronously
        return mockServer
      })
      
      require('../src/index')

      expect(console.log).toHaveBeenCalledWith('🎭 DMX Web Controller running on http://localhost:4000')
      expect(console.log).toHaveBeenCalledWith('📡 DMX Interface: /dev/ttyUSB1')
      expect(console.log).toHaveBeenCalledWith('⚡ Ready for lighting control!')
    })
  })

  describe('Signal Handlers', () => {
    test('should register SIGTERM and SIGINT handlers', () => {
      require('../src/index')

      expect(process.on).toHaveBeenCalledWith('SIGTERM', expect.any(Function))
      expect(process.on).toHaveBeenCalledWith('SIGINT', expect.any(Function))
    })

    describe('Graceful Shutdown', () => {
      let gracefulShutdown

      beforeEach(() => {
        require('../src/index')
        
        // Get the graceful shutdown function
        const sigtermCall = process.on.mock.calls.find(call => call[0] === 'SIGTERM')
        gracefulShutdown = sigtermCall[1]
      })

      test('should log shutdown initiation', () => {
        gracefulShutdown('SIGTERM')

        expect(console.log).toHaveBeenCalledWith('\n🔄 SIGTERM received. Initiating shutdown...')
      })

      test('should stop animations if running', () => {
        mockParLight.isAnimating.mockReturnValue(true)
        
        gracefulShutdown('SIGINT')

        expect(console.log).toHaveBeenCalledWith('🛑 Stopping running animations...')
        expect(mockParLight.stopAnimation).toHaveBeenCalled()
      })

      test('should not attempt to stop animations if not running', () => {
        mockParLight.isAnimating.mockReturnValue(false)
        
        gracefulShutdown('SIGTERM')

        expect(mockParLight.stopAnimation).not.toHaveBeenCalled()
      })

      test('should turn off light', () => {
        gracefulShutdown('SIGTERM')

        expect(console.log).toHaveBeenCalledWith('💡 Turning off light...')
        expect(mockParLight.turnOff).toHaveBeenCalled()
      })

      test('should close server and exit successfully', () => {
        gracefulShutdown('SIGTERM')

        expect(mockServer.close).toHaveBeenCalledWith(expect.any(Function))
        expect(console.log).toHaveBeenCalledWith('✅ Server closed successfully')
        expect(console.log).toHaveBeenCalledWith('👋 DMX Controller terminated')
        expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 500)
        expect(process.exit).toHaveBeenCalledWith(0)
      })

      test('should handle server close errors', () => {
        mockServer.close.mockImplementation((callback) => {
          callback(new Error('Server close failed'))
        })

        gracefulShutdown('SIGTERM')

        expect(console.error).toHaveBeenCalledWith('❌ Error during server shutdown:', expect.any(Error))
        expect(process.exit).toHaveBeenCalledWith(1)
      })

      test('should set timeout for forced shutdown', () => {
        gracefulShutdown('SIGTERM')

        expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 5000)
        
        // Test the timeout callback
        const timeoutCall = global.setTimeout.mock.calls.find(call => call[1] === 5000)
        const timeoutCallback = timeoutCall[0]
        
        // Reset process.exit mock to test timeout behavior
        process.exit.mockClear()
        console.error.mockClear()
        
        timeoutCallback()
        
        expect(console.error).toHaveBeenCalledWith('⏰ Graceful shutdown timeout - forcing termination')
        expect(process.exit).toHaveBeenCalledWith(1)
      })
    })
  })

  describe('Module Behavior', () => {
    test('should not throw errors during initialization', () => {
      expect(() => {
        require('../src/index')
      }).not.toThrow()
    })

    test('should handle missing environment variables gracefully', () => {
      delete process.env.PORT
      delete process.env.DMX_DEVICE

      expect(() => {
        require('../src/index')
      }).not.toThrow()
    })
  })
})