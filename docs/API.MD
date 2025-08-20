# 🔌 REST API Reference

Complete REST API documentation for the DMX Controller Agent.

## Base URL

http://localhost:3000/api

## Response Format

All API responses follow this format:

```json
{
    "success": true|false,
    "message": "Description of action",
    "error": "Error message (only on failures)"
}
```

## 💡 Light Control

### Turn Light On

**POST** `/light/on`

Turn on the light with optional intensity and color.

**Request Body:**

```json
{
    "intensity": 255,    // Optional, 0-255, default: 255
    "color": "white"     // Optional, color name, default: "white"
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/light/on \
  -H "Content-Type: application/json" \
  -d '{"intensity": 200, "color": "blue"}'
```

**Response:**

```json
{
    "success": true,
    "message": "Light turned on"
}
```

---

### Turn Light Off  

**POST** `/light/off`

Turn off the light completely.

**Example:**

```bash
curl -X POST http://localhost:3000/api/light/off
```

**Response:**

```json
{
    "success": true,
    "message": "Light turned off"
}
```

---

### Set Color

**POST** `/light/color`

Change the light color with optional intensity.

**Request Body:**

```json
{
    "color": "red",      // Required, color name
    "intensity": 255     // Optional, 0-255, default: 255
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/light/color \
  -H "Content-Type: application/json" \
  -d '{"color": "purple", "intensity": 180}'
```

---

### Set Master Dimmer

**POST** `/light/dimmer`

Adjust the master brightness level.

**Request Body:**

```json
{
    "value": 128    // Required, 0-255
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/light/dimmer \
  -H "Content-Type: application/json" \
  -d '{"value": 128}'
```

## 🎭 Animations

### Fade Animation

**POST** `/animation/fade`

Smooth color transition to target color.

**Request Body:**

```json
{
    "color": "blue",        // Required, target color name
    "duration": 2000,       // Optional, milliseconds, default: 2000
    "easing": "linear"      // Optional, easing function, default: "linear"
}
```

**Available Easing Functions:**

- `linear`, `inQuad`, `outQuad`, `inOutQuad`
- `inCubic`, `outCubic`, `inOutCubic`  
- `inQuart`, `outQuart`, `inOutQuart`
- `inQuint`, `outQuint`, `inOutQuint`
- `inSine`, `outSine`, `inOutSine`
- `inExpo`, `outExpo`, `inOutExpo`
- `inCirc`, `outCirc`, `inOutCirc`
- `inElastic`, `outElastic`, `inOutElastic`
- `inBack`, `outBack`, `inOutBack`
- `inBounce`, `outBounce`, `inOutBounce`

**Example:**

```bash
curl -X POST http://localhost:3000/api/animation/fade \
  -H "Content-Type: application/json" \
  -d '{"color": "red", "duration": 3000, "easing": "outQuart"}'
```

---

### Pulse Animation

**POST** `/animation/pulse`

Rhythmic brightness variation.

**Request Body:**

```json
{
    "color": "white",        // Optional, pulse color, default: "white"
    "minIntensity": 50,      // Optional, 0-255, default: 50
    "maxIntensity": 255,     // Optional, 0-255, default: 255
    "duration": 2000         // Optional, milliseconds, default: 2000
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/animation/pulse \
  -H "Content-Type: application/json" \
  -d '{"color": "purple", "minIntensity": 30, "maxIntensity": 200, "duration": 2500}'
```

---

### Rainbow Animation

**POST** `/animation/rainbow`

Full spectrum color cycling.

**Request Body:**

```json
{
    "duration": 5000,    // Optional, milliseconds, default: 5000
    "steps": 36          // Optional, color divisions, default: 36
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/animation/rainbow \
  -H "Content-Type: application/json" \
  -d '{"duration": 8000, "steps": 50}'
```

---

### Strobe Effect

**POST** `/animation/strobe`

Rapid on/off flashing.

**Request Body:**

```json
{
    "color": "white",      // Optional, flash color, default: "white"
    "onDuration": 100,     // Optional, milliseconds on, default: 100
    "offDuration": 100     // Optional, milliseconds off, default: 100
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/animation/strobe \
  -H "Content-Type: application/json" \
  -d '{"color": "red", "onDuration": 150, "offDuration": 200}'
```

---

### Color Cycle

**POST** `/animation/cycle`

Sequential cycling through multiple colors.

**Request Body:**

```json
{
    "colors": ["red", "green", "blue"],  // Optional, color array, default: all colors
    "stepDuration": 1000                 // Optional, milliseconds per color, default: 1000
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/animation/cycle \
  -H "Content-Type: application/json" \
  -d '{"colors": ["red", "yellow", "green", "cyan", "blue", "magenta"], "stepDuration": 800}'
```

---

### Stop Animation

**POST** `/animation/stop`

Stop any currently running animation.

**Example:**

```bash
curl -X POST http://localhost:3000/api/animation/stop
```

**Response:**

```json
{
    "success": true,
    "message": "Animation stopped"
}
```

## 📊 Information Endpoints

### Get Available Colors

**GET** `/colors`

Retrieve list of all supported colors.

**Example:**

```bash
curl http://localhost:3000/api/colors
```

**Response:**

```json
{
    "colors": [
        "red", "green", "blue", "white", 
        "yellow", "cyan", "magenta", 
        "orange", "purple", "off"
    ]
}
```

---

### Get Current Status

**GET** `/status`

Get current light state and animation status.

**Example:**

```bash
curl http://localhost:3000/api/status
```

**Response:**

```json
{
    "isAnimating": false,
    "currentState": {
        "masterDimmer": 255,
        "red": 255,
        "green": 0,
        "blue": 0,
        "strobe": 0,
        "mode": 0,
        "hueSpeed": 0
    }
}
```

---

### Health Check

**GET** `/health`

System health and uptime information.

**Example:**

```bash
curl http://localhost:3000/api/health
```

**Response:**

```json
{
    "success": true,
    "status": "healthy",
    "uptime": 1234.567,
    "timestamp": "2024-01-15T10:30:00.000Z",
    "dmx": {
        "connected": true,
        "device": "COM5"
    }
}
```

## 🎨 Color Reference

| Color Name | RGB Values | Hex |
|------------|------------|-----|
| `red` | 255, 0, 0 | #FF0000 |
| `green` | 0, 255, 0 | #00FF00 |
| `blue` | 0, 0, 255 | #0000FF |
| `white` | 255, 255, 255 | #FFFFFF |
| `yellow` | 255, 255, 0 | #FFFF00 |
| `cyan` | 0, 255, 255 | #00FFFF |
| `magenta` | 255, 0, 255 | #FF00FF |
| `orange` | 255, 127, 0 | #FF7F00 |
| `purple` | 127, 0, 255 | #7F00FF |
| `off` | 0, 0, 0 | #000000 |

## 🔧 Error Handling

### HTTP Status Codes

- **200** - Success
- **400** - Bad Request (invalid parameters)
- **500** - Internal Server Error

### Error Response Format

```json
{
    "success": false,
    "error": "Invalid color name: 'invalidcolor'. Available colors: red, green, blue, white, yellow, cyan, magenta, orange, purple, off"
}
```

### Common Error Messages

**Invalid Color:**

```json
{
    "success": false,
    "error": "Invalid color name: 'rainbow'. Available colors: red, green, blue, white, yellow, cyan, magenta, orange, purple, off"
}
```

**Invalid Intensity:**

```json
{
    "success": false,
    "error": "Intensity must be between 0 and 255"
}
```

**Invalid Duration:**

```json
{
    "success": false,
    "error": "Duration must be a positive number"
}
```

## 📱 JavaScript Examples

### Fetch API

```javascript
// Turn on blue light
const response = await fetch('/api/light/on', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ color: 'blue', intensity: 200 })
});
const result = await response.json();

// Start pulse animation
await fetch('/api/animation/pulse', {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        color: 'purple',
        minIntensity: 30,
        maxIntensity: 255,
        duration: 2000
    })
});

// Get current status
const status = await fetch('/api/status').then(r => r.json());
console.log('Current RGB:', status.currentState.red, status.currentState.green, status.currentState.blue);
```

### jQuery

```javascript
// Color change with jQuery
$.ajax({
    url: '/api/light/color',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ color: 'green', intensity: 180 }),
    success: function(result) {
        console.log('Color changed:', result.message);
    }
});

// Start rainbow with error handling
$.ajax({
    url: '/api/animation/rainbow',
    method: 'POST',
    contentType: 'application/json', 
    data: JSON.stringify({ duration: 6000, steps: 42 })
}).done(function(result) {
    console.log('Rainbow started');
}).fail(function(xhr) {
    console.error('Error:', xhr.responseJSON.error);
});
```

### Node.js/Axios

```javascript
const axios = require('axios');

// Turn light on
try {
    const response = await axios.post('http://localhost:3000/api/light/on', {
        color: 'white',
        intensity: 255
    });
    console.log(response.data.message);
} catch (error) {
    console.error('Error:', error.response.data.error);
}

// Chain multiple animations
async function lightShow() {
    await axios.post('http://localhost:3000/api/animation/fade', {
        color: 'red', duration: 1000
    });
    
    await axios.post('http://localhost:3000/api/animation/fade', {
        color: 'green', duration: 1000  
    });
    
    await axios.post('http://localhost:3000/api/animation/fade', {
        color: 'blue', duration: 1000
    });
}
```

## 🚀 Rate Limiting & Production

### Current Limitations

- No authentication required
- No rate limiting implemented
- Designed for local/trusted network use

### Production Recommendations

```javascript
// Add authentication middleware
app.use('/api', authenticateToken);

// Add rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Add CORS for web apps
app.use(cors({
    origin: ['http://localhost:3000', 'https://yourdomain.com']
}));
```

### WebSocket Alternative

For real-time applications, consider WebSocket integration:

```javascript
// Future WebSocket support (planned)
ws://localhost:3000/ws/dmx

// Subscribe to status updates
{ "action": "subscribe", "events": ["status", "animation"] }

// Real-time status broadcasts
{ "event": "status", "data": { "masterDimmer": 128, ... } }
```
