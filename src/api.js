const express = require('express')
const ParLightB262 = require('../devices/ParLightB262')

/**
 * Creates API routes for controlling the ParLightB262 device.
 * @param {ParLightB262} parLight - The ParLightB262 instance to control.
 * @returns {express.Router} - The router with the defined API routes.
 */
function createAPIRoutes (parLight) {
  const router = express.Router()

  // Light Control Routes
  router.post('/light/on', (req, res) => {
    const { intensity = 255, color = 'white' } = req.body
    try {
      parLight.turnOn(intensity, color)
      res.json({ success: true, message: 'Light turned on' })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  })

  router.post('/light/off', (req, res) => {
    try {
      parLight.turnOff()
      res.json({ success: true, message: 'Light turned off' })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  })

  router.post('/light/color', (req, res) => {
    const { color, intensity = 255 } = req.body
    try {
      parLight.setColor(color, intensity)
      res.json({ success: true, message: `Color set to ${color}` })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  })

  router.post('/light/dimmer', (req, res) => {
    const { value } = req.body
    try {
      parLight.setMasterDimmer(value)
      res.json({ success: true, message: `Dimmer set to ${value}` })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  })

  // Animation Routes
  router.post('/animation/fade', (req, res) => {
    const { color, duration = 2000, easing = 'linear' } = req.body
    try {
      parLight.fadeToColor(color, duration, easing)
      res.json({ success: true, message: `Fading to ${color}` })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  })

  router.post('/animation/pulse', (req, res) => {
    const { color = 'white', minIntensity = 50, maxIntensity = 255, duration = 2000 } = req.body
    try {
      parLight.startPulse(color, minIntensity, maxIntensity, duration)
      res.json({ success: true, message: 'Pulse animation started' })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  })

  router.post('/animation/rainbow', (req, res) => {
    const { duration = 5000, steps = 36 } = req.body
    try {
      parLight.startRainbow(duration, steps)
      res.json({ success: true, message: 'Rainbow animation started' })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  })

  router.post('/animation/strobe', (req, res) => {
    const { color = 'white', onDuration = 100, offDuration = 100 } = req.body
    try {
      parLight.startStrobe(color, onDuration, offDuration)
      res.json({ success: true, message: 'Strobe animation started' })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  })

  router.post('/animation/cycle', (req, res) => {
    const { colors = null, stepDuration = 1000 } = req.body
    try {
      parLight.startColorCycle(colors, stepDuration)
      res.json({ success: true, message: 'Color cycle started' })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  })

  router.post('/animation/stop', (req, res) => {
    try {
      parLight.stopAnimation()
      res.json({ success: true, message: 'Animation stopped' })
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  })

  // Info Routes
  router.get('/colors', (req, res) => {
    res.json({ colors: ParLightB262.getAvailableColors() })
  })

  router.get('/status', (req, res) => {
    res.json({
      isAnimating: parLight.isAnimating(),
      currentState: parLight.currentState
    })
  })

  // Health Check Route
  router.get('/health', (req, res) => {
    const healthy = true
    const connected = parLight.isConnected()
    res.json({
      success: true,
      healthy,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      dmx: {
        connected,
        device: process.env.DMX_DEVICE || 'COM5'
      }
    })
  })

  return router
}

module.exports = createAPIRoutes
