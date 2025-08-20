# 🎭 DMX Controller Agent

Node.js-based DMX controller for Par Light B262 fixtures with web interface and REST API.

## 📑 Table of Contents

- [🎭 DMX Controller Agent](#-dmx-controller-agent)
  - [📑 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🚀 Quick Start](#-quick-start)
    - [Native Installation](#native-installation)
    - [Docker (Recommended for Production)](#docker-recommended-for-production)
  - [📚 Dokumentation](#-dokumentation)
  - [⚙️ Hardware](#️-hardware)
  - [🖥️ Plattformen](#️-plattformen)
  - [🔧 Environment](#-environment)
  - [📋 Scripts](#-scripts)
  - [🎮 Quick API Examples](#-quick-api-examples)
  - [🏗️ Integration](#️-integration)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)

## ✨ Features

- 🌐 **Web Interface** for intuitive manual control
- 🔌 **REST API** for programmatic integration  
- 🎨 **6 Animation Types** with 25+ easing functions
- 📱 **Responsive Design** for Mobile/Desktop
- 🐳 **Docker Support** for easy deployment

## 🚀 Quick Start

### Native Installation
```bash
# Installation
npm install

# Server starten
npm start

# Web-Interface öffnen
open http://localhost:3000
```

### Docker (Recommended for Production)
```bash
# Mit Docker Compose
docker-compose up -d

# Web-Interface öffnen
open http://localhost:3000
```

## 📚 Dokumentation

- 📖 **[Usage Guide](docs/usage.md)** - Detaillierte Anwendung
- 🎪 **[Effects & Easing](docs/effects.md)** - Alle Lichteffekte erklärt
- 🔌 **[API Reference](docs/api.md)** - REST API Dokumentation
- 🐳 **[Docker Guide](docs/docker.md)** - Container-Deployment & Docker Compose
- � **[WSL Setup Guide](docs/wsl.md)** - Windows Subsystem for Linux mit USB-Passthrough
- �🔗 **[Integration Examples](docs/integrations.md)** - Home Assistant, Discord, n8n & mehr
- 🛠️ **[Development Guide](docs/development.md)** - Entwicklungsrichtlinien & Standards

## ⚙️ Hardware

- **DMX Interface**: Enttec Open DMX USB
- **Scheinwerfer**: Par Light B262 (7-Kanal Modus)

## 🖥️ Plattformen

| Platform | Status | Notes |
|----------|--------|-------|
| ✅ Windows | Ready | COM-Port supported |
| 🐧 WSL2 | Ready | USB passthrough via usbipd-win |
| 🎯 Raspberry Pi | Ready | Docker recommended |
| 🐳 Docker | Ready | All platforms supported |

## 🔧 Environment

```bash
PORT=3000           # Web server port
DMX_DEVICE=COM5     # DMX interface device
NODE_ENV=production # Environment mode
```

## 📋 Scripts

```bash
npm start       # Production server
npm run dev     # Development with nodemon  
npm test        # Run test sequence
npm run lint    # Check code style (Standard.js)
npm run lint:fix # Auto-fix code style issues
```

## 🎮 Quick API Examples

```bash
# Turn on light
curl -X POST http://localhost:3000/api/light/on \
  -H "Content-Type: application/json" \
  -d '{"color":"blue","intensity":200}'

# Start rainbow animation
curl -X POST http://localhost:3000/api/animation/rainbow \
  -H "Content-Type: application/json" \
  -d '{"duration":5000}'

# Get status
curl http://localhost:3000/api/status
```

## 🏗️ Integration

Designed for use with:

- **n8n** workflows
- **Discord/Telegram** bots
- **Home automation** systems
- **Live performance** setups
- **Docker** environments

See [Integration Examples](docs/integrations.md) for detailed implementation guides.

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-animation`)
3. **Follow** [development guidelines](docs/development.md)
4. **Add** tests for new functionality
5. **Commit** changes (`git commit -m 'Add amazing animation'`)
6. **Push** to branch (`git push origin feature/amazing-animation`)
7. **Submit** Pull Request

See [Development Guide](docs/development.md) for detailed contribution guidelines.

## 📄 License

**ISC** - Feel free to use in your projects!

---

Built with ❤️ for the lighting community

**[⬆ Back to Top](#-dmx-controller-agent)**