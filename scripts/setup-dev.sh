#!/bin/bash
# Development setup script

echo "🛠️  Setting up DMX Controller development environment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup git hooks
echo "🪝 Setting up git hooks..."
npm run prepare

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
# DMX Controller Environment Variables
PORT=3000
DMX_DEVICE=COM5
DEBUG=dmx*
NODE_ENV=development
EOL
    echo "✅ Created .env file with default values"
fi

# Check if DMX device exists (Linux/Mac)
if [[ "$OSTYPE" == "linux-gnu"* ]] || [[ "$OSTYPE" == "darwin"* ]]; then
    if ls /dev/ttyUSB* 1> /dev/null 2>&1; then
        echo "✅ DMX USB devices found:"
        ls /dev/ttyUSB*
    else
        echo "⚠️  No DMX USB devices found. Make sure your Enttec device is connected."
    fi
fi

# Run linting check
echo "🔍 Running linting check..."
if npm run lint > /dev/null 2>&1; then
    echo "✅ Code passes linting checks"
else
    echo "⚠️  Linting issues found, run 'npm run lint:fix' to auto-fix"
fi

# Test if server can start (quick test)
echo "🧪 Testing server startup..."
if timeout 5s npm start > /dev/null 2>&1; then
    echo "✅ Server starts successfully"
else
    echo "⚠️  Server startup test failed - check your DMX device connection"
fi

# Display available npm scripts
echo "📋 Available npm scripts:"
npm run 2>&1 | grep -E "^\s+[a-z]" | sed 's/^/   /'

echo ""
echo "🎉 Development setup complete!"
echo ""
echo "🚀 Quick Start:"
echo "   npm run dev         # Start development server with auto-restart"
echo "   npm start           # Start production server"
echo "   npm test            # Run test light sequence"
echo ""
echo "🔧 Development Tools:"
echo "   npm run lint        # Check code style (Standard.js)"
echo "   npm run lint:fix    # Auto-fix code style issues"
echo ""
echo "📚 Documentation:"
echo "   README.md                # Project overview & quick start"
echo "   docs/usage.md           # Complete usage guide"
echo "   docs/api.md             # REST API reference"
echo "   docs/effects.md         # Light effects & easing functions"
echo "   docs/integrations.md    # Platform integration examples"
echo "   docs/development.md     # Development guidelines & standards"
echo ""
echo "🌐 Web Interface:"
echo "   http://localhost:3000   # Access after running 'npm start' or 'npm run dev'"
echo ""
echo "💡 Next Steps:"
echo "   1. Connect your Enttec DMX USB device"
echo "   2. Set DMX address on your Par Light B262 to 1 (7-channel mode)"
echo "   3. Run 'npm run dev' to start development"
echo "   4. Open http://localhost:3000 in your browser"
echo "   5. Test with 'npm test' to run a light sequence"