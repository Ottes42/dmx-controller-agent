# 📖 Usage Guide

Comprehensive guide for using the DMX Controller Agent.

## 🌐 Web Interface

### Getting Started

1. **Start the server**
   ```bash
   npm start
   ```

2. **Open browser**
   ```
   http://localhost:3000
   ```

3. **Basic controls**
   - Use the **Ein/Aus** buttons for power control
   - Adjust **Master Dimmer** slider for brightness
   - Click **color buttons** for instant color changes

### Interface Sections

#### 💡 Basic Controls
- **Ein/Aus/Stop** - Power and animation control
- **Master Dimmer** - Overall brightness (0-255)

#### 🎨 Colors
- **Color Grid** - Click any color for instant change
- **Intensity Slider** - Brightness for color selection

#### 🌈 Fade Animation
- **Target Color** - Destination color
- **Duration** - Animation time (0.5-10 seconds)
- **Easing** - Movement curve (see [Effects Guide](effects.md))

#### 💗 Pulse Animation
- **Color** - Pulse color
- **Min/Max** - Brightness range
- **Duration** - One complete pulse cycle

#### ✨ Special Animations
- **Rainbow** - Full spectrum cycle
- **Color Cycle** - Multi-color sequence
- **Strobe** - Rapid on/off flashing

#### 📊 Status Panel
- **Animation** - Current animation state
- **Master Dimmer** - Current brightness
- **RGB Values** - Current color values

## 💻 Programmatic Control

### Basic Setup

```javascript
const DMX = require('dmx');
const ParLightB262 = require('./ParLightB262');

// Initialize DMX
const dmx = new DMX();
const universe = dmx.addUniverse('main', 'enttec-open-usb-dmx', 'COM5');
const parLight = new ParLightB262(universe, 1);
```

### Basic Operations

```javascript
// Turn on with white light
parLight.turnOn(255, ParLightB262.COLORS.WHITE);

// Set specific color
parLight.setColor('blue', 200);

// Adjust brightness
parLight.setMasterDimmer(128);

// Turn off
parLight.turnOff();
```

### Animations

```javascript
// Fade to color
parLight.fadeToColor('red', 2000, 'outQuart');

// Pulse effect
parLight.startPulse('purple', 30, 255, 3000, 'inOutSine');

// Rainbow animation
parLight.startRainbow(8000, 50);

// Color cycle
parLight.startColorCycle(['red', 'green', 'blue'], 1000);

// Strobe effect
parLight.startStrobe('white', 100, 100);

// Stop any animation
parLight.stopAnimation();
```

### Animation Callbacks

```javascript
// Chain animations with callbacks
parLight.fadeToColor('blue', 2000, 'linear', () => {
    console.log('Fade complete!');
    parLight.startPulse('blue', 50, 255, 2000);
});

// Promise-style chaining
async function lightSequence() {
    await parLight.fadeToColor('red', 1000);
    await parLight.fadeToColor('green', 1000);  
    await parLight.fadeToColor('blue', 1000);
}
```

## 🔌 REST API Usage

### Authentication
No authentication required for local use.

### Content Type
All POST requests require:
```
Content-Type: application/json
```

### Basic Light Control

```bash
# Turn on light
curl -X POST http://localhost:3000/api/light/on \
  -H "Content-Type: application/json" \
  -d '{"intensity": 255, "color": "white"}'

# Turn off light
curl -X POST http://localhost:3000/api/light/off

# Set color
curl -X POST http://localhost:3000/api/light/color \
  -H "Content-Type: application/json" \
  -d '{"color": "red", "intensity": 200}'

# Set dimmer
curl -X POST http://localhost:3000/api/light/dimmer \
  -H "Content-Type: application/json" \
  -d '{"value": 128}'
```

### Animations

```bash
# Fade animation
curl -X POST http://localhost:3000/api/animation/fade \
  -H "Content-Type: application/json" \
  -d '{"color": "blue", "duration": 2000, "easing": "outQuart"}'

# Pulse animation
curl -X POST http://localhost:3000/api/animation/pulse \
  -H "Content-Type: application/json" \
  -d '{"color": "purple", "minIntensity": 30, "maxIntensity": 255, "duration": 2000}'

# Rainbow animation
curl -X POST http://localhost:3000/api/animation/rainbow \
  -H "Content-Type: application/json" \
  -d '{"duration": 5000, "steps": 36}'

# Stop animation
curl -X POST http://localhost:3000/api/animation/stop
```

### Status Information

```bash
# Get current status
curl http://localhost:3000/api/status

# Get available colors
curl http://localhost:3000/api/colors

# Health check
curl http://localhost:3000/api/health
```

## 🔧 Configuration

### Environment Variables

```bash
# Server port (default: 3000)
export PORT=8080

# DMX device (default: COM5)
export DMX_DEVICE=/dev/ttyUSB0

# Start server
npm start
```

### DMX Channel Mapping

The Par Light B262 uses 7 DMX channels:

| Channel | Function | Range |
|---------|----------|-------|
| 1 | Master Dimmer | 0-255 |
| 2 | Red | 0-255 |
| 3 | Green | 0-255 |
| 4 | Blue | 0-255 |
| 5 | Strobe | 0-255 |
| 6 | Mode | 0-255 |
| 7 | Speed | 0-255 |

### Available Colors

```javascript
ParLightB262.COLORS = {
    RED: 'red',           // 255, 0, 0
    GREEN: 'green',       // 0, 255, 0
    BLUE: 'blue',         // 0, 0, 255
    WHITE: 'white',       // 255, 255, 255
    YELLOW: 'yellow',     // 255, 255, 0
    CYAN: 'cyan',         // 0, 255, 255
    MAGENTA: 'magenta',   // 255, 0, 255
    ORANGE: 'orange',     // 255, 127, 0
    PURPLE: 'purple',     // 127, 0, 255
    OFF: 'off'            // 0, 0, 0
};
```

## 🐛 Troubleshooting

### Common Issues

**Light doesn't respond**
- Check DMX cable connection
- Verify COM port in device manager
- Ensure light is in 7-channel mode
- Try different DMX address

**Animations are jerky**
- Use slower durations (>1000ms)
- Try different easing functions
- Check USB connection quality

**Web interface not loading**
- Check if port 3000 is available
- Try different port: `PORT=8080 npm start`
- Check firewall settings

**Permission errors on Linux**
```bash
# Add user to dialout group
sudo usermod -a -G dialout $USER
# Logout and login again
```

### Debug Mode

```bash
# Enable verbose logging
DEBUG=dmx* npm start
```

## 📱 Mobile Usage

The web interface is fully responsive:

- **Portrait mode**: Stacked cards for easy scrolling
- **Landscape mode**: Grid layout for all controls
- **Touch optimized**: Large buttons and sliders
- **Gesture support**: Swipe for color selection

## 🔗 Integration

For detailed integration examples with various platforms, see the **[Integration Guide](integrations.md)**:

- 🏠 **Home Assistant** - YAML configurations and dashboard cards
- 🤖 **Discord/Telegram Bots** - Chat-based lighting control
- 🔄 **n8n Workflows** - Automation and scheduling
- 🎮 **Gaming/Streaming** - OBS, Twitch integration
- 🎵 **Music Sync** - Spotify-based lighting
- 🌐 **Web Frameworks** - React, Vue.js components
- 📊 **Monitoring** - Prometheus metrics