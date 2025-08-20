# 🎭 DMX Controller Agent

Node.js-basierter DMX Controller für Par Light B262 Scheinwerfer mit Web-Interface und REST API.

## ✨ Features

- 🌐 **Web-Interface** für intuitive manuelle Steuerung
- 🔌 **REST API** für programmatische Integration  
- 🎨 **6 Animationstypen** mit 25+ Easing-Funktionen
- 📱 **Responsive Design** für Mobile/Desktop
- ⚡ **Graceful Shutdown** mit automatischem Licht-Aus

## 🚀 Quick Start

```bash
# Installation
npm install

# Server starten
npm start

# Web-Interface öffnen
open http://localhost:3000
```

## 📚 Dokumentation

- 📖 **[Usage Guide](docs/usage.md)** - Detaillierte Anwendung
- 🎪 **[Effects & Easing](docs/effects.md)** - Alle Lichteffekte erklärt
- 🔌 **[API Reference](docs/api.md)** - REST API Dokumentation
- 🔗 **[Integration Examples](docs/integrations.md)** - Home Assistant, Discord, n8n & mehr
- 🛠️ **[Development Guide](docs/development.md)** - Entwicklungsrichtlinien & Standards

## ⚙️ Hardware

- **DMX Interface**: Enttec Open DMX USB
- **Scheinwerfer**: Par Light B262 (7-Kanal Modus)

## 🖥️ Plattformen

| Platform | Status | Notes |
|----------|--------|-------|
| ✅ Windows | Ready | COM-Port supported |
| 🚧 WSL2 | WIP | USB passthrough needed |
| 🎯 Raspberry Pi | Planned | Target deployment |

## 🔧 Environment

```bash
PORT=3000           # Web server port
DMX_DEVICE=COM5     # DMX interface device
```

## 📋 Scripts

```bash
npm start    # Production server
npm run dev  # Development with nodemon  
npm test     # Run test sequence
npm run lint # Check code style
```

## 🎮 Quick API Examples

```bash
# Turn on light
curl -X POST http://localhost:3000/api/light/on \
  -d '{"color":"blue","intensity":200}'

# Start rainbow animation
curl -X POST http://localhost:3000/api/animation/rainbow \
  -d '{"duration":5000}'
```

## 🏗️ Integration

Designed for use with:
- **n8n** workflows
- **Discord/Telegram** bots
- **Home automation** systems
- **Live performance** setups

## 📁 Project Structure

```
dmx/
├── src/                    # Hauptquellcode
│   ├── index.js           # Express Server & Startup
│   └── api.js             # REST API Routes
├── devices/               # DMX Geräte-Abstraktionen  
│   └── ParLightB262.js    # Par Light B262 Geräteklasse
├── docs/                  # Dokumentation
│   ├── usage.md          # Anwendungshandbuch
│   ├── api.md            # API Referenz
│   ├── effects.md        # Effekte & Easing
│   ├── integrations.md   # Integration-Beispiele
│   └── development.md    # Entwicklungsrichtlinien
├── public/               # Web Interface
│   ├── index.html       # Frontend HTML
│   ├── style.css        # Styling
│   └── script.js        # Frontend JavaScript
├── scripts/              # Setup & Utility Scripts
│   └── setup-dev.sh     # Entwicklungsumgebung Setup
├── .husky/              # Git Hooks (Husky)
├── test.js              # Test-Sequenzen
├── package.json         # Dependencies & Scripts
└── README.md           # Diese Datei
```

## 🚀 Zukünftige Erweiterungen

```
devices/
├── ParLightB262.js      # Aktuell
├── MovingHead.js        # Geplant  
├── LaserProjector.js    # Geplant
└── base/                # Abstrakte Basisklassen
    └── DMXDevice.js
```

## 🤝 Contributing

1. Fork the repo
2. Create feature branch
3. Follow [development guidelines](docs/development.md)
4. Add tests for new effects
5. Submit PR

## 📄 License

ISC - Feel free to use in your projects!

---

*Built with ❤️ for the lighting community*