const ParLightB262 = require('../devices/ParLightB262')
const { mockUniverse, mockAnimation, mockAnim } = require('./__mocks__/dmx')

// Mock the dmx/anim module properly
jest.mock('dmx/anim')
jest.mock('dmx')

describe('ParLightB262', () => {
  let parLight
  let mockUniverseInstance

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks()
    
    // Create fresh mock universe for each test
    mockUniverseInstance = {
      update: jest.fn(),
      get: jest.fn(() => 128), // Default return valid DMX value
    }
    
    // Mock Anim constructor
    require('dmx/anim').mockImplementation(() => ({
      add: jest.fn().mockReturnThis(),
      run: jest.fn(),
      stop: jest.fn()
    }))
    
    parLight = new ParLightB262(mockUniverseInstance, 10)
  })

  describe('Constructor and Constants', () => {
    test('should initialize with correct channel mapping', () => {
      expect(parLight.startChannel).toBe(10)
      expect(parLight.universe).toBe(mockUniverseInstance)
      expect(parLight.channels).toEqual({
        masterDimmer: 10,
        red: 11,
        green: 12,
        blue: 13,
        strobe: 14,
        mode: 15,
        hueSpeed: 16
      })
    })

    test('should initialize with default start channel 1', () => {
      const defaultLight = new ParLightB262(mockUniverseInstance)
      expect(defaultLight.startChannel).toBe(1)
      expect(defaultLight.channels.masterDimmer).toBe(1)
    })

    test('should initialize current state to all zeros', () => {
      expect(parLight.currentState).toEqual({
        masterDimmer: 0,
        red: 0,
        green: 0,
        blue: 0,
        strobe: 0,
        mode: 0,
        hueSpeed: 0
      })
    })

    test('should have correct color constants', () => {
      expect(ParLightB262.COLORS).toEqual({
        RED: 'red',
        GREEN: 'green',
        BLUE: 'blue',
        WHITE: 'white',
        YELLOW: 'yellow',
        CYAN: 'cyan',
        MAGENTA: 'magenta',
        ORANGE: 'orange',
        PURPLE: 'purple',
        OFF: 'off'
      })
    })

    test('should have correct mode constants', () => {
      expect(ParLightB262.MODES).toEqual({
        MANUAL: 0,
        HUE_SELECT: 35,
        HUE_SHIFT: 85,
        HUE_PULSE: 135,
        HUE_TRANSITION: 185,
        SOUND_CONTROL: 235
      })
    })
  })

  describe('Basic Control Methods', () => {
    test('turnOn should set master dimmer and optionally color', () => {
      parLight.turnOn(200, 'red')
      
      expect(parLight.currentState.masterDimmer).toBe(200)
      // setColor uses default intensity of 255, not the turnOn intensity
      expect(parLight.currentState.red).toBe(255)
      expect(parLight.currentState.green).toBe(0)
      expect(parLight.currentState.blue).toBe(0)
      expect(mockUniverseInstance.update).toHaveBeenCalled()
    })

    test('turnOn should work with defaults', () => {
      parLight.turnOn()
      
      expect(parLight.currentState.masterDimmer).toBe(255)
    })

    test('turnOff should set master dimmer to 0 and color to off', () => {
      parLight.turnOff()
      
      expect(parLight.currentState.masterDimmer).toBe(0)
      expect(parLight.currentState.red).toBe(0)
      expect(parLight.currentState.green).toBe(0)
      expect(parLight.currentState.blue).toBe(0)
    })

    test('setMasterDimmer should clamp values and update universe', () => {
      parLight.setMasterDimmer(100)
      expect(parLight.currentState.masterDimmer).toBe(100)
      expect(mockUniverseInstance.update).toHaveBeenCalledWith({ 10: 100 })

      parLight.setMasterDimmer(-10)
      expect(parLight.currentState.masterDimmer).toBe(0)

      parLight.setMasterDimmer(300)
      expect(parLight.currentState.masterDimmer).toBe(255)
    })

    test('setRGB should set RGB values and update universe', () => {
      parLight.setRGB(255, 128, 64)
      
      expect(parLight.currentState.red).toBe(255)
      expect(parLight.currentState.green).toBe(128)
      expect(parLight.currentState.blue).toBe(64)
      expect(mockUniverseInstance.update).toHaveBeenCalledWith({
        11: 255,
        12: 128,
        13: 64
      })
    })

    test('setRGB should clamp out-of-range values', () => {
      parLight.setRGB(-10, 300, 128)
      
      expect(parLight.currentState.red).toBe(0)
      expect(parLight.currentState.green).toBe(255)
      expect(parLight.currentState.blue).toBe(128)
    })

    test('setStrobe should handle zero and valid range', () => {
      parLight.setStrobe(0)
      expect(parLight.currentState.strobe).toBe(0)

      parLight.setStrobe(5) // Below minimum, should be clamped to 8
      expect(parLight.currentState.strobe).toBe(8)

      parLight.setStrobe(100)
      expect(parLight.currentState.strobe).toBe(100)

      parLight.setStrobe(300) // Above maximum, should be clamped to 255
      expect(parLight.currentState.strobe).toBe(255)
    })
  })

  describe('Color Control', () => {
    test('setColor should set valid color with intensity', () => {
      parLight.setColor('red', 200)
      
      expect(parLight.currentState.red).toBe(200)
      expect(parLight.currentState.green).toBe(0)
      expect(parLight.currentState.blue).toBe(0)
    })

    test('setColor should work with case insensitive input', () => {
      parLight.setColor('RED', 100)
      parLight.setColor('Blue', 150)
      
      expect(parLight.currentState.blue).toBe(150)
    })

    test('setColor should throw error for invalid color', () => {
      expect(() => {
        parLight.setColor('invalid_color')
      }).toThrow('Unknown color: \'invalid_color\'. Available colors:')
    })

    test('setColor should use default intensity 255', () => {
      parLight.setColor('white')
      
      expect(parLight.currentState.red).toBe(255)
      expect(parLight.currentState.green).toBe(255)
      expect(parLight.currentState.blue).toBe(255)
    })

    test('setColor should scale RGB values with intensity', () => {
      parLight.setColor('white', 128)
      
      expect(parLight.currentState.red).toBe(128)
      expect(parLight.currentState.green).toBe(128)
      expect(parLight.currentState.blue).toBe(128)
    })

    test('setColor should handle mixed colors correctly', () => {
      parLight.setColor('yellow', 200)
      
      expect(parLight.currentState.red).toBe(200)
      expect(parLight.currentState.green).toBe(200)
      expect(parLight.currentState.blue).toBe(0)
    })
  })

  describe('Static Color Methods', () => {
    test('getAvailableColors should return all color values', () => {
      const colors = ParLightB262.getAvailableColors()
      expect(colors).toContain('red')
      expect(colors).toContain('green')
      expect(colors).toContain('blue')
      expect(colors).toContain('white')
      expect(colors).toHaveLength(10)
    })

    test('isValidColor should validate colors correctly', () => {
      expect(ParLightB262.isValidColor('red')).toBe(true)
      expect(ParLightB262.isValidColor('RED')).toBe(true)
      expect(ParLightB262.isValidColor('invalid')).toBe(false)
    })
  })

  describe('Mode Control Methods', () => {
    test('setManualMode should set correct mode value', () => {
      parLight.setManualMode()
      
      expect(parLight.currentState.mode).toBe(ParLightB262.MODES.MANUAL)
      expect(mockUniverseInstance.update).toHaveBeenCalledWith({ 15: 0 })
    })

    test('setHueSelect should set mode and hue value', () => {
      parLight.setHueSelect(100)
      
      expect(parLight.currentState.mode).toBe(ParLightB262.MODES.HUE_SELECT)
      expect(parLight.currentState.hueSpeed).toBe(100)
      expect(mockUniverseInstance.update).toHaveBeenCalledWith({ 15: 35, 16: 100 })
    })

    test('setHueShift should work with default speed', () => {
      parLight.setHueShift()
      
      expect(parLight.currentState.mode).toBe(ParLightB262.MODES.HUE_SHIFT)
      expect(parLight.currentState.hueSpeed).toBe(128)
    })

    test('setSoundControl should clamp sensitivity values', () => {
      parLight.setSoundControl(300)
      
      expect(parLight.currentState.mode).toBe(ParLightB262.MODES.SOUND_CONTROL)
      expect(parLight.currentState.hueSpeed).toBe(255)
    })
  })

  describe('Animation Creation Methods', () => {
    test('createFadeAnimation should create animation with valid color', () => {
      const mockAnimInstance = { add: jest.fn().mockReturnThis() }
      require('dmx/anim').mockImplementation(() => mockAnimInstance)
      
      const animation = parLight.createFadeAnimation('red', 3000, 'ease')
      
      expect(require('dmx/anim')).toHaveBeenCalled()
      expect(mockAnimInstance.add).toHaveBeenCalledWith({
        11: 255, // red channel
        12: 0,   // green channel
        13: 0    // blue channel
      }, 3000, { easing: 'ease' })
    })

    test('createFadeAnimation should throw error for invalid color', () => {
      expect(() => {
        parLight.createFadeAnimation('invalid_color')
      }).toThrow('Invalid target color: invalid_color')
    })

    test('createFadeAnimation should work with RGB array', () => {
      const mockAnimInstance = { add: jest.fn().mockReturnThis() }
      require('dmx/anim').mockImplementation(() => mockAnimInstance)
      
      parLight.createFadeAnimation([128, 64, 32])
      
      expect(mockAnimInstance.add).toHaveBeenCalledWith({
        11: 128,
        12: 64,
        13: 32
      }, 2000, { easing: 'linear' })
    })

    test('createPulseAnimation should create looped animation', () => {
      const mockAnimInstance = {
        add: jest.fn().mockReturnThis()
      }
      require('dmx/anim').mockImplementation(() => mockAnimInstance)
      
      parLight.createPulseAnimation('blue', 50, 200, 1000, 'ease')
      
      expect(require('dmx/anim')).toHaveBeenCalledWith({ loop: Infinity })
      // Should have two add calls (min and max intensity)
      expect(mockAnimInstance.add).toHaveBeenCalledTimes(2)
    })

    test('createRainbowAnimation should create animation with correct steps', () => {
      const mockAnimInstance = { add: jest.fn().mockReturnThis() }
      require('dmx/anim').mockImplementation(() => mockAnimInstance)
      
      parLight.createRainbowAnimation(3600, 12)
      
      expect(mockAnimInstance.add).toHaveBeenCalledTimes(12)
    })

    test('createColorCycleAnimation should use default colors when none provided', () => {
      const mockAnimInstance = { add: jest.fn().mockReturnThis() }
      require('dmx/anim').mockImplementation(() => mockAnimInstance)
      
      parLight.createColorCycleAnimation()
      
      // Should have 6 default colors
      expect(mockAnimInstance.add).toHaveBeenCalledTimes(6)
    })
  })

  describe('Animation Control Methods', () => {
    test('startAnimation should stop current animation and start new one', () => {
      const oldAnim = { stop: jest.fn() }
      const newAnim = { run: jest.fn(), stop: jest.fn() }
      const finishCallback = jest.fn()
      
      parLight.currentAnimation = oldAnim
      parLight.startAnimation(newAnim, finishCallback)
      
      expect(oldAnim.stop).toHaveBeenCalled()
      expect(parLight.currentAnimation).toBe(newAnim)
      expect(newAnim.run).toHaveBeenCalledWith(mockUniverseInstance, finishCallback)
    })

    test('stopAnimation should stop current animation and clear reference', () => {
      const mockAnim = { stop: jest.fn() }
      parLight.currentAnimation = mockAnim
      
      parLight.stopAnimation()
      
      expect(mockAnim.stop).toHaveBeenCalled()
      expect(parLight.currentAnimation).toBeNull()
    })

    test('stopAnimation should handle no current animation gracefully', () => {
      parLight.currentAnimation = null
      
      expect(() => parLight.stopAnimation()).not.toThrow()
      expect(parLight.currentAnimation).toBeNull()
    })

    test('isAnimating should return correct status', () => {
      expect(parLight.isAnimating()).toBe(false)
      
      parLight.currentAnimation = { stop: jest.fn() }
      expect(parLight.isAnimating()).toBe(true)
      
      parLight.stopAnimation()
      expect(parLight.isAnimating()).toBe(false)
    })
  })

  describe('Convenience Animation Methods', () => {
    test('fadeToColor should create and start fade animation', () => {
      const mockAnimInstance = { add: jest.fn().mockReturnThis(), run: jest.fn(), stop: jest.fn() }
      require('dmx/anim').mockImplementation(() => mockAnimInstance)
      
      parLight.fadeToColor('red', 1000, 'ease')
      
      expect(parLight.currentAnimation).toBe(mockAnimInstance)
      expect(mockAnimInstance.run).toHaveBeenCalled()
    })

    test('startPulse should create and start pulse animation', () => {
      const mockAnimInstance = { add: jest.fn().mockReturnThis(), run: jest.fn(), stop: jest.fn() }
      require('dmx/anim').mockImplementation(() => mockAnimInstance)
      
      parLight.startPulse('green', 30, 220, 2000, 'linear')
      
      expect(parLight.currentAnimation).toBe(mockAnimInstance)
    })

    test('startRainbow should create and start rainbow animation', () => {
      const mockAnimInstance = { add: jest.fn().mockReturnThis(), run: jest.fn(), stop: jest.fn() }
      require('dmx/anim').mockImplementation(() => mockAnimInstance)
      
      parLight.startRainbow(4000, 24)
      
      expect(parLight.currentAnimation).toBe(mockAnimInstance)
    })
  })

  describe('Connection Status', () => {
    test('isConnected should return true for valid DMX response', () => {
      mockUniverseInstance.get.mockReturnValue(128)
      
      expect(parLight.isConnected()).toBe(true)
    })

    test('isConnected should return false for out-of-range DMX value', () => {
      mockUniverseInstance.get.mockReturnValue(300)
      
      expect(parLight.isConnected()).toBe(false)
    })

    test('isConnected should return false on exception', () => {
      mockUniverseInstance.get.mockImplementation(() => {
        throw new Error('DMX error')
      })
      
      expect(parLight.isConnected()).toBe(false)
    })
  })

  describe('Private Helper Methods', () => {
    test('_clamp should constrain values to valid range', () => {
      expect(parLight._clamp(-10)).toBe(0)
      expect(parLight._clamp(128)).toBe(128)
      expect(parLight._clamp(300)).toBe(255)
      expect(parLight._clamp(50, 10, 100)).toBe(50)
      expect(parLight._clamp(5, 10, 100)).toBe(10)
      expect(parLight._clamp(150, 10, 100)).toBe(100)
    })

    test('_hsvToRgb should convert HSV to RGB correctly', () => {
      // Test pure red (0° hue)
      const red = parLight._hsvToRgb(0, 1, 1)
      expect(red).toEqual([255, 0, 0])
      
      // Test pure green (120° hue)
      const green = parLight._hsvToRgb(1/3, 1, 1)
      expect(green).toEqual([0, 255, 0])
      
      // Test pure blue (240° hue)
      const blue = parLight._hsvToRgb(2/3, 1, 1)
      expect(blue).toEqual([0, 0, 255])
      
      // Test white (no saturation)
      const white = parLight._hsvToRgb(0, 0, 1)
      expect(white).toEqual([255, 255, 255])
    })

    test('_updateChannels should call universe.update with correct mapping', () => {
      parLight.currentState.red = 100
      parLight.currentState.green = 150
      
      parLight._updateChannels(['red', 'green'])
      
      expect(mockUniverseInstance.update).toHaveBeenCalledWith({
        11: 100, // red channel
        12: 150  // green channel
      })
    })

    test('_updateChannels should handle single channel string', () => {
      parLight.currentState.masterDimmer = 200
      
      parLight._updateChannels('masterDimmer')
      
      expect(mockUniverseInstance.update).toHaveBeenCalledWith({
        10: 200 // masterDimmer channel
      })
    })
  })

  describe('Method Chaining', () => {
    test('should support method chaining for basic control', () => {
      const result = parLight
        .setMasterDimmer(200)
        .setColor('red')
        .setStrobe(50)
      
      expect(result).toBe(parLight)
      expect(parLight.currentState.masterDimmer).toBe(200)
      // setColor uses default intensity of 255
      expect(parLight.currentState.red).toBe(255)
      expect(parLight.currentState.strobe).toBe(50)
    })

    test('should support method chaining for modes', () => {
      const result = parLight.setManualMode().setHueShift(100)
      
      expect(result).toBe(parLight)
    })
  })
})