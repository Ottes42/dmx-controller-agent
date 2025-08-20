# DMX Controller Agent - Developer Instructions

**ALWAYS follow these instructions first. Only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

## Project Overview

This is a Node.js DMX lighting controller for Par Light B262 fixtures with a web interface and REST API. The application works with or without DMX hardware connected - it gracefully handles missing hardware during development.

## Bootstrap Instructions

### Required Setup Steps
Run these commands in order to set up the development environment:

```bash
# Clone and navigate to repository
git clone https://github.com/Ottes42/dmx-controller-agent.git
cd dmx-controller-agent

# Install dependencies - takes 30-60 seconds  
npm install

# Run the automated setup script - takes 1-2 minutes
bash scripts/setup-dev.sh

# Verify installation with tests - takes 2 seconds
npm test
```

**CRITICAL TIMING**: `npm install` takes 30-60 seconds and installs 787 packages. `npm test` is lightning-fast (1-2 seconds) with no timeout concerns.

### Development Setup Script
The `scripts/setup-dev.sh` script automatically:
- Installs dependencies
- Sets up git hooks (Husky/lint-staged)
- Creates `.env` file with default values
- Validates code passes linting
- Tests basic server startup
- Lists all available npm scripts

## Build and Test Commands

### Essential Commands (All Verified Working)
```bash
# Install dependencies - NEVER CANCEL, takes 30-60 seconds
npm install

# Run test suite - FAST execution, 2 seconds maximum
npm test

# Run tests with coverage report - FAST execution, 2 seconds maximum  
npm run test:coverage

# Check code style - FAST execution, under 1 second
npm run lint

# Auto-fix code style issues - FAST execution, under 1 second
npm run lint:fix

# Start development server with auto-reload - ready in under 5 seconds
npm run dev

# Start production server - ready in under 5 seconds
npm start

# Security audit - takes 5-10 seconds
npm run audit:security

# Hardware test sequence (requires DMX device)
npm run test:hardware
```

**TIMEOUT GUIDANCE**: Only `npm install` requires extended time (30-60 seconds). All other commands complete in under 5 seconds.

## Running the Application

### Development Server
```bash
npm run dev
```
- Starts nodemon development server
- Auto-reloads on file changes
- Accessible at `http://localhost:3000`
- Works without DMX hardware (shows connection error but remains functional)

### Production Server
```bash
npm start
```
- Starts production server
- Accessible at `http://localhost:3000`  
- Set `PORT=3001` environment variable to use different port

### Environment Variables
Create `.env` file or set these variables:
```bash
PORT=3000           # Web server port
DMX_DEVICE=COM5     # Windows: COM5, Linux: /dev/ttyUSB0  
NODE_ENV=development
DEBUG=dmx*
```

## Validation Requirements

### ALWAYS Test These Scenarios After Changes
After making any changes, ALWAYS validate with these complete end-to-end scenarios:

1. **Basic Functionality Test**:
```bash
# Start server
npm run dev

# Test health endpoint (in another terminal)
curl http://localhost:3000/api/health

# Test color endpoint  
curl http://localhost:3000/api/colors

# Test light control
curl -X POST http://localhost:3000/api/light/on \
  -H "Content-Type: application/json" \
  -d '{"intensity": 128, "color": "blue"}'
```

2. **Code Quality Validation**:
```bash
npm run lint
npm test  
npm run test:coverage
```

3. **Web Interface Test**:
- Open `http://localhost:3000` in browser
- Verify interface loads and color picker works
- Test basic controls (even without hardware)

## Repository Structure

### Key Directories
```
dmx-controller-agent/
├── src/                    # Core server code
│   ├── index.js           # Express server entry point
│   └── api.js             # REST API routes factory
├── devices/               # DMX device abstractions  
│   └── ParLightB262.js    # Par Light B262 device class
├── tests/                 # Test suite (94 tests, 88% coverage)
│   ├── __mocks__/         # Mock DMX hardware
│   ├── ParLightB262.test.js
│   ├── api.test.js
│   └── index.test.js
├── public/                # Web interface (vanilla JS)
│   ├── index.html         # Frontend HTML
│   ├── style.css          # Styling  
│   └── script.js          # Frontend JavaScript
├── scripts/               # Utility scripts
│   ├── setup-dev.sh       # Development setup
│   └── test.js            # Hardware test sequence
└── docs/                  # Documentation
```

### Critical Files to Check After Changes
- `devices/ParLightB262.js` - Always test device logic changes
- `src/api.js` - Always test API changes with `npm test`  
- `src/index.js` - Always test server startup changes
- `package.json` - Always run `npm install` after dependency changes

## Testing Strategy

### Test Suite Coverage
- **94 total tests** covering all core functionality
- **~88% statement coverage**, ~57% branch coverage
- **Fast execution**: Complete test suite runs in 1-2 seconds
- **Comprehensive mocking**: No DMX hardware required for tests

### Test Categories
```bash
npm test              # Unit tests (94 tests, 1-2 seconds)
npm run test:watch    # Watch mode for development  
npm run test:coverage # Coverage report
npm run test:hardware # Hardware integration test (requires DMX device)
```

## Code Standards

### Linting (Standard.js)
- **Pre-commit hooks**: Automatically lint staged files
- **2 spaces** indentation, **single quotes**, **no semicolons**
- **Lint before committing**: Pre-commit hooks enforce this automatically

### Development Tools
```bash
npm run lint          # Check code style
npm run lint:fix      # Auto-fix style issues
```

## Known Limitations

### Docker Build Issues
- **Docker build currently fails** in some environments due to npm ci issues
- **Use native Node.js development** instead of Docker for now
- All other workflows (npm install, test, dev server) work perfectly

### Hardware Dependencies
- Application **works without DMX hardware** connected
- Hardware test script **fails gracefully** without device
- Development and testing **do not require DMX device**

## Architecture Patterns

### DMX Integration Pattern
```javascript
// Always follow this initialization pattern
const dmx = new DMX()
const universe = dmx.addUniverse('ottes', 'enttec-open-usb-dmx', dmxDevice)
const parLight = new ParLightB262(universe, startChannel)
```

### API Response Pattern
```javascript
// Always return this structure
{ success: boolean, message: string, error?: string }
```

### Route Organization
- `/api/light/*` - Basic control (on/off/color/dimmer)
- `/api/animation/*` - Effect control (fade/pulse/rainbow/strobe/cycle/stop)
- `/api/colors`, `/api/status`, `/api/health` - Info endpoints

## Common Development Tasks

### Adding New Features
1. **Write tests first** - Add to appropriate test file in `tests/`
2. **Implement feature** - Follow existing patterns
3. **Run validation**: `npm run lint && npm test`
4. **Test manually** - Use validation scenarios above
5. **Update documentation** if needed

### Debugging Issues
- **Check server logs** - Emoji prefixes help identify log sources  
- **Test API endpoints** directly with curl
- **Use browser dev tools** for web interface issues
- **Check DMX connection** via `/api/health` endpoint

**Key insight**: This codebase has excellent test coverage and fast feedback loops. The 94-test suite runs in 1-2 seconds, making TDD workflow very efficient.
