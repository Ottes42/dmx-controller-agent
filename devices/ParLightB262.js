const Anim = require('dmx/anim')

class ParLightB262 {
  // Color constants
  static COLORS = {
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
  }

  // Mode constants
  static MODES = {
    MANUAL: 0,
    HUE_SELECT: 35,
    HUE_SHIFT: 85,
    HUE_PULSE: 135,
    HUE_TRANSITION: 185,
    SOUND_CONTROL: 235
  }

  constructor (universe, startChannel = 1) {
    this.universe = universe
    this.startChannel = startChannel

    // Channel mapping (relative to start address)
    this.channels = {
      masterDimmer: startChannel,
      red: startChannel + 1,
      green: startChannel + 2,
      blue: startChannel + 3,
      strobe: startChannel + 4,
      mode: startChannel + 5,
      hueSpeed: startChannel + 6
    }

    // Store current values
    this.currentState = {
      masterDimmer: 0,
      red: 0,
      green: 0,
      blue: 0,
      strobe: 0,
      mode: 0,
      hueSpeed: 0
    }

    // Color definitions
    this._colorDefinitions = {
      [ParLightB262.COLORS.RED]: [255, 0, 0],
      [ParLightB262.COLORS.GREEN]: [0, 255, 0],
      [ParLightB262.COLORS.BLUE]: [0, 0, 255],
      [ParLightB262.COLORS.WHITE]: [255, 255, 255],
      [ParLightB262.COLORS.YELLOW]: [255, 255, 0],
      [ParLightB262.COLORS.CYAN]: [0, 255, 255],
      [ParLightB262.COLORS.MAGENTA]: [255, 0, 255],
      [ParLightB262.COLORS.ORANGE]: [255, 127, 0],
      [ParLightB262.COLORS.PURPLE]: [127, 0, 255],
      [ParLightB262.COLORS.OFF]: [0, 0, 0]
    }

    // Animation tracking
    this.currentAnimation = null
  }

  turnOn (intensity = 255, color = null) {
    this.setMasterDimmer(intensity)
    if (color) this.setColor(color)
    return this
  }

  turnOff () {
    this.setMasterDimmer(0)
    this.setColor(ParLightB262.COLORS.OFF)
    return this
  }

  // Basic control
  setMasterDimmer (value) {
    this.currentState.masterDimmer = this._clamp(value)
    this._updateChannels('masterDimmer')
    return this
  }

  setRGB (red, green, blue) {
    this.currentState.red = this._clamp(red)
    this.currentState.green = this._clamp(green)
    this.currentState.blue = this._clamp(blue)
    this._updateChannels(['red', 'green', 'blue'])
    return this
  }

  setStrobe (speed = 0) {
    if (speed === 0) {
      this.currentState.strobe = 0
    } else {
      this.currentState.strobe = this._clamp(speed, 8, 255)
    }
    this._updateChannels('strobe')
    return this
  }

  // Enhanced color control with error handling
  setColor (colorName, intensity = 255) {
    // Normalize input to lowercase
    const normalizedColor = colorName.toLowerCase()

    // Check if color exists
    if (!this._colorDefinitions[normalizedColor]) {
      const availableColors = Object.values(ParLightB262.COLORS).join(', ')
      throw new Error(`Unknown color: '${colorName}'. Available colors: ${availableColors}`)
    }

    intensity = this._clamp(intensity)
    const [r, g, b] = this._colorDefinitions[normalizedColor]

    // Scale RGB values with intensity
    this.setRGB(
      Math.floor((r / 255) * intensity),
      Math.floor((g / 255) * intensity),
      Math.floor((b / 255) * intensity)
    )
    return this
  }

  // Static method to get all available colors
  static getAvailableColors () {
    return Object.values(ParLightB262.COLORS)
  }

  // Check if color is available
  static isValidColor (colorName) {
    return Object.values(ParLightB262.COLORS).includes(colorName.toLowerCase())
  }

  // Modes with constants
  setManualMode () {
    this.currentState.mode = ParLightB262.MODES.MANUAL
    this._updateChannels('mode')
    return this
  }

  setHueSelect (hue = 128) {
    this.currentState.mode = ParLightB262.MODES.HUE_SELECT
    this.currentState.hueSpeed = this._clamp(hue)
    this._updateChannels(['mode', 'hueSpeed'])
    return this
  }

  setHueShift (speed = 128) {
    this.currentState.mode = ParLightB262.MODES.HUE_SHIFT
    this.currentState.hueSpeed = this._clamp(speed)
    this._updateChannels(['mode', 'hueSpeed'])
    return this
  }

  setHuePulse (speed = 128) {
    this.currentState.mode = ParLightB262.MODES.HUE_PULSE
    this.currentState.hueSpeed = this._clamp(speed)
    this._updateChannels(['mode', 'hueSpeed'])
    return this
  }

  setHueTransition (speed = 128) {
    this.currentState.mode = ParLightB262.MODES.HUE_TRANSITION
    this.currentState.hueSpeed = this._clamp(speed)
    this._updateChannels(['mode', 'hueSpeed'])
    return this
  }

  setSoundControl (sensitivity = 128) {
    this.currentState.mode = ParLightB262.MODES.SOUND_CONTROL
    this.currentState.hueSpeed = this._clamp(sensitivity)
    this._updateChannels(['mode', 'hueSpeed'])
    return this
  }

  // DMX Animation methods
  createFadeAnimation (targetColor, duration = 2000, easing = 'linear') {
    const targetRGB = typeof targetColor === 'string'
      ? this._colorDefinitions[targetColor.toLowerCase()]
      : targetColor

    if (!targetRGB) {
      throw new Error(`Invalid target color: ${targetColor}`)
    }

    const anim = new Anim()
    anim.add({
      [this.channels.red]: targetRGB[0],
      [this.channels.green]: targetRGB[1],
      [this.channels.blue]: targetRGB[2]
    }, duration, { easing })

    return anim
  }

  createColorCycleAnimation (colors = null, stepDuration = 1000, easing = 'linear') {
    const defaultColors = [
      ParLightB262.COLORS.RED,
      ParLightB262.COLORS.GREEN,
      ParLightB262.COLORS.BLUE,
      ParLightB262.COLORS.YELLOW,
      ParLightB262.COLORS.CYAN,
      ParLightB262.COLORS.MAGENTA
    ]

    const cycleColors = colors || defaultColors
    const anim = new Anim({ loop: Infinity })

    cycleColors.forEach(colorName => {
      const rgb = this._colorDefinitions[colorName.toLowerCase()]
      if (rgb) {
        anim.add({
          [this.channels.red]: rgb[0],
          [this.channels.green]: rgb[1],
          [this.channels.blue]: rgb[2]
        }, stepDuration, { easing })
      }
    })

    return anim
  }

  createPulseAnimation (color = ParLightB262.COLORS.WHITE, minIntensity = 50, maxIntensity = 255, pulseDuration = 2000, easing = 'inOutSine') {
    const pulseColor = typeof color === 'string'
      ? this._colorDefinitions[color.toLowerCase()]
      : color

    if (!pulseColor) {
      throw new Error(`Invalid pulse color: ${color}`)
    }

    const anim = new Anim({ loop: Infinity })

    // Fade to min intensity
    anim.add({
      [this.channels.red]: Math.floor((pulseColor[0] / 255) * minIntensity),
      [this.channels.green]: Math.floor((pulseColor[1] / 255) * minIntensity),
      [this.channels.blue]: Math.floor((pulseColor[2] / 255) * minIntensity)
    }, pulseDuration / 2, { easing })

    // Fade to max intensity
    anim.add({
      [this.channels.red]: Math.floor((pulseColor[0] / 255) * maxIntensity),
      [this.channels.green]: Math.floor((pulseColor[1] / 255) * maxIntensity),
      [this.channels.blue]: Math.floor((pulseColor[2] / 255) * maxIntensity)
    }, pulseDuration / 2, { easing })

    return anim
  }

  createStrobeAnimation (color = ParLightB262.COLORS.WHITE, onDuration = 100, offDuration = 100) {
    const strobeColor = typeof color === 'string'
      ? this._colorDefinitions[color.toLowerCase()]
      : color

    if (!strobeColor) {
      throw new Error(`Invalid strobe color: ${color}`)
    }

    const anim = new Anim({ loop: Infinity })

    // On state
    anim.add({
      [this.channels.red]: strobeColor[0],
      [this.channels.green]: strobeColor[1],
      [this.channels.blue]: strobeColor[2]
    }, onDuration, { easing: 'linear' })

    // Off state
    anim.add({
      [this.channels.red]: 0,
      [this.channels.green]: 0,
      [this.channels.blue]: 0
    }, offDuration, { easing: 'linear' })

    return anim
  }

  createRainbowAnimation (cycleDuration = 5000, steps = 36) {
    const anim = new Anim({ loop: Infinity })

    for (let i = 0; i < steps; i++) {
      const hue = (i / steps) * 360
      const rgb = this._hsvToRgb(hue / 360, 1, 1)

      anim.add({
        [this.channels.red]: rgb[0],
        [this.channels.green]: rgb[1],
        [this.channels.blue]: rgb[2]
      }, cycleDuration / steps, { easing: 'linear' })
    }

    return anim
  }

  createDimmerFade (targetIntensity, duration = 2000, easing = 'linear') {
    const anim = new Anim()
    anim.add({
      [this.channels.masterDimmer]: this._clamp(targetIntensity)
    }, duration, { easing })

    return anim
  }

  // Animation control methods
  startAnimation (animation, onFinish = null) {
    this.stopAnimation()
    this.currentAnimation = animation
    animation.run(this.universe, onFinish)
    return this
  }

  stopAnimation () {
    if (this.currentAnimation) {
      this.currentAnimation.stop()
      this.currentAnimation = null
    }
    return this
  }

  isAnimating () {
    return this.currentAnimation !== null
  }

  // Convenience methods for common animations
  fadeToColor (color, duration = 2000, easing = 'linear', onFinish = null) {
    return this.startAnimation(this.createFadeAnimation(color, duration, easing), onFinish)
  }

  startColorCycle (colors = null, stepDuration = 1000, easing = 'linear', onFinish = null) {
    return this.startAnimation(this.createColorCycleAnimation(colors, stepDuration, easing), onFinish)
  }

  startPulse (color = ParLightB262.COLORS.WHITE, minIntensity = 50, maxIntensity = 255, pulseDuration = 2000, easing = 'inOutSine', onFinish = null) {
    return this.startAnimation(this.createPulseAnimation(color, minIntensity, maxIntensity, pulseDuration, easing), onFinish)
  }

  startStrobe (color = ParLightB262.COLORS.WHITE, onDuration = 100, offDuration = 100, onFinish = null) {
    return this.startAnimation(this.createStrobeAnimation(color, onDuration, offDuration), onFinish)
  }

  startRainbow (cycleDuration = 5000, steps = 36, onFinish = null) {
    return this.startAnimation(this.createRainbowAnimation(cycleDuration, steps), onFinish)
  }

  fadeDimmer (targetIntensity, duration = 2000, easing = 'linear', onFinish = null) {
    return this.startAnimation(this.createDimmerFade(targetIntensity, duration, easing), onFinish)
  }

  isConnected () {
    try {
      const dim = parseInt(this.universe.get(this.channels.masterDimmer), 10)
      return dim >= 0 && dim <= 255
    } catch (error) {
      return false
    }
  }

  // Private helper methods
  _clamp (value, min = 0, max = 255) {
    return Math.max(min, Math.min(max, value))
  }

  _updateChannels (channels) {
    if (!Array.isArray(channels)) channels = [channels]
    const update = {}
    channels.forEach(channel => {
      const value = this.currentState[channel]
      update[this.channels[channel]] = value
    })
    this.universe.update(update)
  }

  _hsvToRgb (h, s, v) {
    let r, g, b

    const i = Math.floor(h * 6)
    const f = h * 6 - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)

    switch (i % 6) {
      case 0: r = v; g = t; b = p; break
      case 1: r = q; g = v; b = p; break
      case 2: r = p; g = v; b = t; break
      case 3: r = p; g = q; b = v; break
      case 4: r = t; g = p; b = v; break
      case 5: r = v; g = p; b = q; break
    }

    return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)]
  }
}

module.exports = ParLightB262
