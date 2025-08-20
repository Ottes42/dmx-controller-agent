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
npm run lint

# Test if server can start (quick test)
echo "🧪 Testing server startup..."
timeout 5s npm start > /dev/null 2>&1 && echo "✅ Server starts successfully" || echo "⚠️  Server startup test failed"

echo "🎉 Development setup complete!"
echo ""
echo "📋 Next steps:"
echo "   npm run dev     # Start development server"
echo "   npm run lint    # Check code style"
echo "   npm test        # Run test sequence"
echo "   npm start       # Start production server"
echo ""
echo "🔗 Documentation:"
echo "   README.md       # Project overview"
echo "   docs/usage.md   # Usage guide"
echo "   docs/api.md     # API reference"