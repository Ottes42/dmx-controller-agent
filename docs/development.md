# 🛠️ Development Guide

Development setup and guidelines for contributing to the DMX Controller Agent.

## 🚀 Quick Setup

```bash
# Clone and install
git clone https://github.com/yourusername/dmx-controller-agent.git
cd dmx-controller-agent
npm install

# Setup git hooks
npm run prepare

# Start development server
npm run dev
```

## 📋 Code Standards

This project uses **Standard.js** for consistent code formatting and linting.

### Linting Commands

```bash
# Check for linting errors
npm run lint

# Auto-fix linting errors
npm run lint:fix

# Watch mode with auto-restart
npm run dev
```

### Pre-commit Hooks

Husky automatically runs linting on all staged files before commits:

```bash
# This will automatically run on git commit
git add .
git commit -m "Add new feature"
# → Runs standard --fix on all staged .js files
# → Commit proceeds only if no errors remain
```

### Standard.js Rules

Key rules enforced:
- **2 spaces** for indentation
- **Single quotes** for strings
- **No semicolons** (except where required)
- **Space after keywords** (`if (condition)`)
- **No trailing whitespace**
- **Unix line endings**

#### Good Examples ✅

```javascript
// Correct spacing and quotes
const express = require('express')
const app = express()

// Proper function declaration
function handleLightCommand (message, args) {
  const color = args[1] || 'white'
  const intensity = parseInt(args[2]) || 255
  
  if (color && intensity > 0) {
    console.log(`Setting light to ${color}`)
  }
}

// Proper async/await
async function setColor (color) {
  try {
    const response = await fetch('/api/light/color', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ color })
    })
    return await response.json()
  } catch (error) {
    console.error('Failed to set color:', error)
  }
}
```

#### Bad Examples ❌

```javascript
// Wrong: semicolons, double quotes, bad spacing
const express = require("express");
const app = express();

// Wrong: no spaces, inconsistent indentation
function handleLightCommand(message,args){
    const color=args[1]||"white";
    const intensity=parseInt(args[2])||255;
    
      if(color&&intensity>0){
        console.log(`Setting light to ${color}`);
      }
}

// Wrong: mixed spacing, trailing comma
async function setColor( color ) {
  try{
    const response = await fetch("/api/light/color",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({color,}),
    });
    return await response.json();
  }catch(error){
    console.error("Failed to set color:",error);
  }
}
```

## 🏗️ Project Structure

```
dmx/
├── .husky/              # Git hooks
│   └── pre-commit       # Runs linting before commits
├── docs/                # Documentation
│   ├── api.md          # API reference
│   ├── effects.md      # Effects guide
│   ├── integrations.md # Integration examples
│   ├── usage.md        # Usage guide
│   └── development.md  # This file
├── public/             # Web interface
│   ├── index.html      # Frontend HTML
│   ├── style.css       # CSS styles
│   └── script.js       # Frontend JavaScript
├── ParLightB262.js     # DMX device driver
├── api.js              # REST API routes
├── index.js            # Main server
├── test.js             # Test sequences
├── package.json        # Dependencies & scripts
└── README.md           # Project overview
```

## 🧪 Testing

### Manual Testing

```bash
# Run test sequence
npm test

# Test specific functions
node -e "
const ParLightB262 = require('./ParLightB262')
const DMX = require('dmx')
const dmx = new DMX()
const universe = dmx.addUniverse('test', 'enttec-open-usb-dmx', 'COM5')
const light = new ParLightB262(universe, 1)
light.fadeToColor('red', 2000, 'outQuart')
"
```

### API Testing

```bash
# Test server endpoints
curl -X POST http://localhost:3000/api/light/on
curl -X POST http://localhost:3000/api/animation/rainbow
curl http://localhost:3000/api/status
```

### Linting Tests

```bash
# Check specific file
npx standard ParLightB262.js

# Check all files
npx standard

# Fix all auto-fixable issues
npx standard --fix
```

## 🔄 Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/new-animation

# Make changes (files automatically linted on commit)
# ... edit code ...

# Commit (pre-commit hooks run automatically)
git add .
git commit -m "Add strobe animation with customizable timing"

# Push and create PR
git push origin feature/new-animation
```

### 2. Code Review Checklist

- [ ] **Standard.js compliant** (automatically checked)
- [ ] **Tests pass** (`npm test`)
- [ ] **API endpoints documented** (in `docs/api.md`)
- [ ] **New effects documented** (in `docs/effects.md`)
- [ ] **Integration examples** (if applicable)
- [ ] **Backward compatible** (existing API unchanged)

### 3. Release Process

```bash
# Update version
npm version patch  # or minor/major

# Tag release
git tag v1.0.1
git push origin v1.0.1

# Publish (if public)
npm publish
```

## 🐛 Debugging

### DMX Connection Issues

```bash
# Check available ports (Windows)
mode

# Check permissions (Linux)
ls -l /dev/ttyUSB*
sudo usermod -a -G dialout $USER

# Debug DMX communication
DEBUG=dmx* npm start
```

### API Debugging

```bash
# Enable verbose logging
DEBUG=express:* npm start

# Test with curl
curl -v -X POST http://localhost:3000/api/light/on \
  -H "Content-Type: application/json" \
  -d '{"color": "red"}'
```

### Standard.js Issues

```bash
# Show all linting errors
npx standard --verbose

# Fix specific file
npx standard --fix ParLightB262.js

# Ignore specific rules (avoid if possible)
/* eslint-disable no-unused-vars */
const unusedVariable = 'value'
/* eslint-enable no-unused-vars */
```

## 📦 Adding Dependencies

### Production Dependencies

```bash
# Add runtime dependency
npm install --save new-package

# Example: Add WebSocket support
npm install --save ws
```

### Development Dependencies

```bash
# Add dev dependency
npm install --save-dev new-dev-package

# Example: Add testing framework
npm install --save-dev jest
```

### Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update all to latest compatible versions
npm update

# Update to latest major versions
npm install package@latest
```

## 🎯 Best Practices

### Code Organization

```javascript
// Good: Clear separation of concerns
class ParLightB262 {
  constructor (universe, startChannel) {
    this.universe = universe
    this.startChannel = startChannel
    this.currentState = this.getInitialState()
  }
  
  // Public API methods first
  turnOn (intensity = 255, color = 'white') {
    this.validateIntensity(intensity)
    this.validateColor(color)
    this.setColor(color, intensity)
  }
  
  // Private helper methods last
  validateIntensity (intensity) {
    if (intensity < 0 || intensity > 255) {
      throw new Error('Intensity must be between 0 and 255')
    }
  }
}
```

### Error Handling

```javascript
// Good: Consistent error handling
async function handleAPIRequest (req, res) {
  try {
    const { color, intensity } = req.body
    
    if (!ParLightB262.isValidColor(color)) {
      return res.status(400).json({
        success: false,
        error: `Invalid color: ${color}`
      })
    }
    
    parLight.setColor(color, intensity)
    
    res.json({
      success: true,
      message: `Color set to ${color}`
    })
  } catch (error) {
    console.error('API Error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}
```

### Documentation

```javascript
/**
 * Creates a fade animation to the specified color.
 * @param {string} targetColor - The target color name
 * @param {number} [duration=2000] - Animation duration in milliseconds
 * @param {string} [easing='linear'] - Easing function name
 * @param {Function} [callback] - Optional completion callback
 * @returns {Promise} Promise that resolves when animation completes
 */
fadeToColor (targetColor, duration = 2000, easing = 'linear', callback = null) {
  return new Promise((resolve, reject) => {
    // Implementation...
  })
}
```

## 🔐 Security Guidelines

### Input Validation

```javascript
// Always validate user input
function validateAnimationParams (params) {
  const { duration, color, intensity } = params
  
  if (duration && (duration < 100 || duration > 60000)) {
    throw new Error('Duration must be between 100ms and 60s')
  }
  
  if (color && !ParLightB262.isValidColor(color)) {
    throw new Error(`Invalid color: ${color}`)
  }
  
  if (intensity && (intensity < 0 || intensity > 255)) {
    throw new Error('Intensity must be between 0 and 255')
  }
}
```

### API Security

```javascript
// Rate limiting for production
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

app.use('/api', limiter)
```

## 📝 Contributing

### Submitting Issues

1. **Search existing issues** before creating new ones
2. **Use issue templates** when available
3. **Provide minimal reproduction** steps
4. **Include environment info** (OS, Node version, etc.)

### Pull Requests

1. **Fork the repository**
2. **Create feature branch** from `main`
3. **Follow coding standards** (enforced by pre-commit hooks)
4. **Add tests** for new functionality
5. **Update documentation** as needed
6. **Submit PR** with clear description

### Commit Messages

Follow conventional commits:

```bash
# Good commit messages
git commit -m "feat: add strobe animation with customizable timing"
git commit -m "fix: resolve DMX connection timeout issue"
git commit -m "docs: update API documentation for new endpoints"
git commit -m "refactor: extract color validation to utility function"

# Types: feat, fix, docs, style, refactor, test, chore
```

## 🚀 Deployment

### Production Checklist

- [ ] **Environment variables** configured
- [ ] **DMX device** properly connected
- [ ] **Firewall rules** configured
- [ ] **Process manager** (PM2) setup
- [ ] **Logging** configured
- [ ] **Monitoring** enabled
- [ ] **Backup strategy** in place

### PM2 Setup

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start index.js --name dmx-controller

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

This development guide ensures consistent, high-quality code across all contributions! 🛠️✨