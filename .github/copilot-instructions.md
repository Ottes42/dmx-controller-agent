# DMX Controller Agent - AI Coding Instructions

## Project Overview

This is a Node.js DMX lighting controller for Par Light B262 fixtures with a web interface and REST API. The system abstracts DMX hardware control through device classes and provides both programmatic API access and a responsive web UI for lighting control.

## Architecture & Key Components

**Core Structure:**
- `src/index.js` - Express server entry point, DMX universe setup, graceful shutdown handling
- `src/api.js` - REST API routes factory function, returns router for ParLightB262 control  
- `devices/ParLightB262.js` - Hardware abstraction class for 7-channel DMX Par lights
- `public/` - Static web interface (vanilla JS, no framework)

**DMX Integration Pattern:**
```javascript
// Always follow this initialization pattern
const dmx = new DMX()
const universe = dmx.addUniverse('ottes', 'enttec-open-usb-dmx', dmxDevice)
const parLight = new ParLightB262(universe, startChannel)
```

## Device Class Patterns

**ParLightB262 Channel Mapping:**
- Uses 7-channel mode: masterDimmer, red, green, blue, strobe, mode, hueSpeed
- Always validate colors using `ParLightB262.getAvailableColors()` or `isValidColor()`
- State tracking in `currentState` object - update this when changing values
- Method chaining pattern: `parLight.setColor('red').setMasterDimmer(200)`

**Animation System:**
- Built on `dmx/anim` - create animations with `new Anim()`, add steps with `.add()`
- Animation state tracking via `currentAnimation` property and `isAnimating()` method
- Always `stopAnimation()` before starting new ones to prevent conflicts
- Use `createXAnimation()` methods to build animations, `startX()` for convenience

## API Design Patterns

**Request/Response Format:**
```javascript
// Always return this structure
{ success: boolean, message: string, error?: string }

// Parameter validation pattern
const { intensity = 255, color = 'white' } = req.body
try {
  parLight.turnOn(intensity, color)
  res.json({ success: true, message: 'Light turned on' })
} catch (error) {
  res.status(400).json({ success: false, error: error.message })
}
```

**Route Organization:**
- `/light/*` - Basic control (on/off/color/dimmer)
- `/animation/*` - Effect control (fade/pulse/rainbow/strobe/cycle/stop)
- Info endpoints: `/colors`, `/status`, `/health`

## Development Workflow

**Code Standards:**
- Uses Standard.js with Husky pre-commit hooks
- Lint with `npm run lint`, auto-fix with `npm run lint:fix`
- **English-only codebase**: All comments, console output, and error messages in English
- Debug output: Use descriptive console.log messages with emojis for visual distinction

**Testing & Development:**
- `npm run dev` for nodemon development server
- `scripts/test.js` for hardware testing sequences - shows animation chaining patterns
- Mock hardware by checking DMX device availability in development

**Environment Configuration:**
```bash
PORT=3000           # Web server port  
DMX_DEVICE=COM5     # DMX interface (Windows) or /dev/ttyUSB0 (Linux)
NODE_ENV=production # Affects error reporting detail
```

## Deployment & Integration Patterns

**Docker Deployment:**
- Multi-stage build with node:24-alpine base
- Requires USB device access for DMX hardware: `--device=/dev/ttyUSB0`
- Run as non-root user for security (dmx:dmx)

**Integration Points:**
- REST API designed for Home Assistant, n8n, Discord bots
- Web interface mobile-responsive for tablet/phone control
- Health endpoint for monitoring: `/api/health` returns DMX connection status

## Common Patterns & Examples

**Adding New Animations:**
1. Create `createXAnimation()` method in ParLightB262
2. Add convenience `startX()` method  
3. Add API route in `/animation/x` endpoint
4. Update color validation and parameter handling

**Translation & Localization:**
- **English-only codebase**: All new code, comments, and messages must be in English
- Error messages should be descriptive and include context for debugging
- Use consistent terminology: "fixture" not "light", "animation" not "effect"
- Console output uses emoji prefixes for visual distinction in logs

**Error Handling:**
- Hardware errors: Check `isConnected()` before operations
- Color validation: Use static methods on ParLightB262.COLORS
- Animation conflicts: Always `stopAnimation()` first
- Graceful shutdown: Turn off lights and stop animations
- **Debug output**: Include descriptive error messages with context

**Console Output Pattern:**
```javascript
// Use emoji prefixes for visual distinction in logs
console.log('🎭 DMX Web Controller running on http://localhost:3000')
console.log('📡 DMX Interface: /dev/ttyUSB0')
console.error('❌ Error during server shutdown:', err)
```

**Web Interface Updates:**
- Frontend uses vanilla JS fetch API, no build process
- Color picker reflects `ParLightB262.COLORS` constants
- Status updates via polling `/api/status` endpoint
- Mobile-first responsive design approach
