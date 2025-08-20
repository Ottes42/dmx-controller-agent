const express = require('express')
const path = require('path')
const DMX = require('dmx')
const ParLightB262 = require('../devices/ParLightB262')
const createAPIRoutes = require('./api')

const app = express()
const port = process.env.PORT || 3000
const dmxDevice = process.env.DMX_DEVICE || 'COM5'

// DMX Setup
const dmx = new DMX()
const universe = dmx.addUniverse('ottes', 'enttec-open-usb-dmx', dmxDevice)
const parLight = new ParLightB262(universe, 1)

// Middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

// API Routes
app.use('/api', createAPIRoutes(parLight))

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

// Start server
const server = app.listen(port, () => {
  console.log(`🎭 DMX Web Controller running on http://localhost:${port}`)
  console.log(`📡 DMX Interface: ${dmxDevice}`)
  console.log('⚡ Ready for lighting control!')
})

// Graceful shutdown handling
process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)

function gracefulShutdown (signal) {
  console.log(`\n🔄 ${signal} received. Initiating shutdown...`)

  // Stop any running animations
  if (parLight.isAnimating()) {
    console.log('🛑 Stopping running animations...')
    parLight.stopAnimation()
  }

  // Turn off light
  console.log('💡 Turning off light...')
  parLight.turnOff()

  // Close server
  server.close((err) => {
    if (err) {
      console.error('❌ Error during server shutdown:', err)
      process.exit(1)
    }

    console.log('✅ Server closed successfully')

    // Give DMX time to send final commands
    setTimeout(() => {
      console.log('👋 DMX Controller terminated')
      process.exit(0)
    }, 500)
  })

  // Force exit after 5 seconds if graceful shutdown fails
  setTimeout(() => {
    console.error('⏰ Graceful shutdown timeout - forcing termination')
    process.exit(1)
  }, 5000)
}
