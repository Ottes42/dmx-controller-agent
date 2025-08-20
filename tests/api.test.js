const express = require('express')
const request = require('supertest')
const createAPIRoutes = require('../src/api')
const ParLightB262 = require('../devices/ParLightB262')

// Mock the ParLightB262 module
jest.mock('../devices/ParLightB262')

describe('API Routes', () => {
  let app
  let mockParLight

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks()

    // Create mock ParLightB262 instance
    mockParLight = {
      turnOn: jest.fn().mockReturnThis(),
      turnOff: jest.fn().mockReturnThis(),
      setColor: jest.fn().mockReturnThis(),
      setMasterDimmer: jest.fn().mockReturnThis(),
      fadeToColor: jest.fn().mockReturnThis(),
      startPulse: jest.fn().mockReturnThis(),
      startRainbow: jest.fn().mockReturnThis(),
      startStrobe: jest.fn().mockReturnThis(),
      startColorCycle: jest.fn().mockReturnThis(),
      stopAnimation: jest.fn().mockReturnThis(),
      isAnimating: jest.fn(() => false),
      isConnected: jest.fn(() => true),
      currentState: {
        masterDimmer: 0,
        red: 0,
        green: 0,
        blue: 0,
        strobe: 0,
        mode: 0,
        hueSpeed: 0
      }
    }

    // Mock static methods
    ParLightB262.getAvailableColors = jest.fn(() => [
      'red', 'green', 'blue', 'white', 'yellow', 'cyan', 'magenta', 'orange', 'purple', 'off'
    ])

    // Create Express app with API routes
    app = express()
    app.use(express.json())
    app.use('/api', createAPIRoutes(mockParLight))
  })

  describe('Light Control Routes', () => {
    describe('POST /api/light/on', () => {
      test('should turn on light with default parameters', async () => {
        const response = await request(app)
          .post('/api/light/on')
          .send({}) // Send empty body to trigger defaults
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Light turned on'
        })
        expect(mockParLight.turnOn).toHaveBeenCalledWith(255, 'white')
      })

      test('should turn on light with custom intensity and color', async () => {
        const response = await request(app)
          .post('/api/light/on')
          .send({ intensity: 150, color: 'red' })
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Light turned on'
        })
        expect(mockParLight.turnOn).toHaveBeenCalledWith(150, 'red')
      })

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
    })

    describe('POST /api/light/off', () => {
      test('should turn off light successfully', async () => {
        const response = await request(app)
          .post('/api/light/off')
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Light turned off'
        })
        expect(mockParLight.turnOff).toHaveBeenCalled()
      })

      test('should handle errors from turnOff', async () => {
        mockParLight.turnOff.mockImplementation(() => {
          throw new Error('DMX communication error')
        })

        const response = await request(app)
          .post('/api/light/off')
          .expect(400)

        expect(response.body).toEqual({
          success: false,
          error: 'DMX communication error'
        })
      })
    })

    describe('POST /api/light/color', () => {
      test('should set color with default intensity', async () => {
        const response = await request(app)
          .post('/api/light/color')
          .send({ color: 'blue' })
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Color set to blue'
        })
        expect(mockParLight.setColor).toHaveBeenCalledWith('blue', 255)
      })

      test('should set color with custom intensity', async () => {
        const response = await request(app)
          .post('/api/light/color')
          .send({ color: 'green', intensity: 128 })
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Color set to green'
        })
        expect(mockParLight.setColor).toHaveBeenCalledWith('green', 128)
      })

      test('should handle invalid color', async () => {
        mockParLight.setColor.mockImplementation(() => {
          throw new Error('Unknown color: invalid')
        })

        const response = await request(app)
          .post('/api/light/color')
          .send({ color: 'invalid' })
          .expect(400)

        expect(response.body).toEqual({
          success: false,
          error: 'Unknown color: invalid'
        })
      })
    })

    describe('POST /api/light/dimmer', () => {
      test('should set dimmer value', async () => {
        const response = await request(app)
          .post('/api/light/dimmer')
          .send({ value: 180 })
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Dimmer set to 180'
        })
        expect(mockParLight.setMasterDimmer).toHaveBeenCalledWith(180)
      })

      test('should handle missing value parameter', async () => {
        const response = await request(app)
          .post('/api/light/dimmer')
          .send({})
          .expect(200)

        expect(mockParLight.setMasterDimmer).toHaveBeenCalledWith(undefined)
      })
    })
  })

  describe('Animation Routes', () => {
    describe('POST /api/animation/fade', () => {
      test('should start fade animation with defaults', async () => {
        const response = await request(app)
          .post('/api/animation/fade')
          .send({ color: 'red' })
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Fading to red'
        })
        expect(mockParLight.fadeToColor).toHaveBeenCalledWith('red', 2000, 'linear')
      })

      test('should start fade animation with custom parameters', async () => {
        const response = await request(app)
          .post('/api/animation/fade')
          .send({ color: 'blue', duration: 5000, easing: 'ease-in' })
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Fading to blue'
        })
        expect(mockParLight.fadeToColor).toHaveBeenCalledWith('blue', 5000, 'ease-in')
      })
    })

    describe('POST /api/animation/pulse', () => {
      test('should start pulse animation with defaults', async () => {
        const response = await request(app)
          .post('/api/animation/pulse')
          .send({})
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Pulse animation started'
        })
        expect(mockParLight.startPulse).toHaveBeenCalledWith('white', 50, 255, 2000)
      })

      test('should start pulse animation with custom parameters', async () => {
        const response = await request(app)
          .post('/api/animation/pulse')
          .send({
            color: 'purple',
            minIntensity: 30,
            maxIntensity: 200,
            duration: 3000
          })
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Pulse animation started'
        })
        expect(mockParLight.startPulse).toHaveBeenCalledWith('purple', 30, 200, 3000)
      })
    })

    describe('POST /api/animation/rainbow', () => {
      test('should start rainbow animation with defaults', async () => {
        const response = await request(app)
          .post('/api/animation/rainbow')
          .send({})
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Rainbow animation started'
        })
        expect(mockParLight.startRainbow).toHaveBeenCalledWith(5000, 36)
      })

      test('should start rainbow animation with custom parameters', async () => {
        const response = await request(app)
          .post('/api/animation/rainbow')
          .send({ duration: 8000, steps: 48 })
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Rainbow animation started'
        })
        expect(mockParLight.startRainbow).toHaveBeenCalledWith(8000, 48)
      })
    })

    describe('POST /api/animation/strobe', () => {
      test('should start strobe animation with defaults', async () => {
        const response = await request(app)
          .post('/api/animation/strobe')
          .send({})
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Strobe animation started'
        })
        expect(mockParLight.startStrobe).toHaveBeenCalledWith('white', 100, 100)
      })

      test('should start strobe animation with custom parameters', async () => {
        const response = await request(app)
          .post('/api/animation/strobe')
          .send({
            color: 'red',
            onDuration: 50,
            offDuration: 150
          })
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Strobe animation started'
        })
        expect(mockParLight.startStrobe).toHaveBeenCalledWith('red', 50, 150)
      })
    })

    describe('POST /api/animation/cycle', () => {
      test('should start color cycle with defaults', async () => {
        const response = await request(app)
          .post('/api/animation/cycle')
          .send({})
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Color cycle started'
        })
        expect(mockParLight.startColorCycle).toHaveBeenCalledWith(null, 1000)
      })

      test('should start color cycle with custom parameters', async () => {
        const colors = ['red', 'green', 'blue']
        const response = await request(app)
          .post('/api/animation/cycle')
          .send({ colors, stepDuration: 2000 })
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Color cycle started'
        })
        expect(mockParLight.startColorCycle).toHaveBeenCalledWith(colors, 2000)
      })
    })

    describe('POST /api/animation/stop', () => {
      test('should stop animation', async () => {
        const response = await request(app)
          .post('/api/animation/stop')
          .expect(200)

        expect(response.body).toEqual({
          success: true,
          message: 'Animation stopped'
        })
        expect(mockParLight.stopAnimation).toHaveBeenCalled()
      })

      test('should handle errors from stopAnimation', async () => {
        mockParLight.stopAnimation.mockImplementation(() => {
          throw new Error('Animation stop failed')
        })

        const response = await request(app)
          .post('/api/animation/stop')
          .expect(400)

        expect(response.body).toEqual({
          success: false,
          error: 'Animation stop failed'
        })
      })
    })
  })

  describe('Info Routes', () => {
    describe('GET /api/colors', () => {
      test('should return available colors', async () => {
        const response = await request(app)
          .get('/api/colors')
          .expect(200)

        expect(response.body).toEqual({
          colors: [
            'red', 'green', 'blue', 'white', 'yellow', 
            'cyan', 'magenta', 'orange', 'purple', 'off'
          ]
        })
        expect(ParLightB262.getAvailableColors).toHaveBeenCalled()
      })
    })

    describe('GET /api/status', () => {
      test('should return current status', async () => {
        mockParLight.isAnimating.mockReturnValue(true)
        mockParLight.currentState = {
          masterDimmer: 200,
          red: 255,
          green: 0,
          blue: 0,
          strobe: 0,
          mode: 0,
          hueSpeed: 0
        }

        const response = await request(app)
          .get('/api/status')
          .expect(200)

        expect(response.body).toEqual({
          isAnimating: true,
          currentState: {
            masterDimmer: 200,
            red: 255,
            green: 0,
            blue: 0,
            strobe: 0,
            mode: 0,
            hueSpeed: 0
          }
        })
        expect(mockParLight.isAnimating).toHaveBeenCalled()
      })
    })

    describe('GET /api/health', () => {
      test('should return health status with connected DMX', async () => {
        mockParLight.isConnected.mockReturnValue(true)
        process.env.DMX_DEVICE = '/dev/ttyUSB0'

        const response = await request(app)
          .get('/api/health')
          .expect(200)

        expect(response.body).toMatchObject({
          success: true,
          healthy: true,
          dmx: {
            connected: true,
            device: '/dev/ttyUSB0'
          }
        })
        expect(response.body.uptime).toBeGreaterThan(0)
        expect(response.body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      })

      test('should return health status with disconnected DMX', async () => {
        mockParLight.isConnected.mockReturnValue(false)
        delete process.env.DMX_DEVICE

        const response = await request(app)
          .get('/api/health')
          .expect(200)

        expect(response.body.dmx).toEqual({
          connected: false,
          device: 'COM5' // default value
        })
      })
    })
  })

  describe('Error Handling', () => {
    test('should handle missing required parameters', async () => {
      mockParLight.fadeToColor.mockImplementation(() => {
        throw new Error('Color is required')
      })

      const response = await request(app)
        .post('/api/animation/fade')
        .send({}) // Missing color
        .expect(400)

      expect(response.body).toEqual({
        success: false,
        error: 'Color is required'
      })
    })
  })

  describe('Route Return Values', () => {
    test('createAPIRoutes should return Express Router', () => {
      const router = createAPIRoutes(mockParLight)
      expect(typeof router).toBe('function')
      expect(router.stack).toBeDefined() // Router has middleware stack
    })
  })
})