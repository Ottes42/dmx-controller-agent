# DMX Controller Agent

Ein Node.js-basierter DMX Controller für Par Light B262 Scheinwerfer mit Animationsunterstützung.

## Features

- **DMX-Steuerung** für Par Light B262 RGB-Scheinwerfer
- **Animationen**: Fade, Color Cycle, Pulse, Strobe, Rainbow
- **Easing-Funktionen** für natürliche Übergänge
- **Callback-Support** für Animation-Sequenzen
- **Modulares Design** mit wiederverwendbarer ParLightB262-Klasse

## Hardware-Anforderungen

- **DMX Interface**: Enttec Open DMX USB
- **Scheinwerfer**: Par Light B262 oder kompatible RGB-DMX-Geräte

## Plattform-Unterstützung

| Plattform | Status | Notizen |
|-----------|---------|---------|
| ✅ Windows | Funktional | COM-Port direkt unterstützt |
| 🚧 WSL2 | In Arbeit | USB-Durchleitung erforderlich |
| 🚧 Docker | Geplant | Device-Mapping für USB-Geräte |
| 🎯 Raspberry Pi | Geplant | Ziel-Deployment-Plattform |

## Installation

```bash
npm install
```

## Verwendung

### Grundlegende Steuerung
```javascript
const ParLightB262 = require('./ParLightB262');
const parLight = new ParLightB262(universe, 1);

// Licht einschalten
parLight.turnOn(255, ParLightB262.COLORS.WHITE);

// Farbe setzen
parLight.setColor(ParLightB262.COLORS.RED);

// Animation
parLight.fadeToColor(ParLightB262.COLORS.BLUE, 2000, 'linear');
```

### Verfügbare Animationen
- `fadeToColor()` - Sanfter Farbübergang
- `startColorCycle()` - Farbzyklus
- `startPulse()` - Pulsierender Effekt  
- `startStrobe()` - Stroboskop-Effekt
- `startRainbow()` - Regenbogen-Animation
- `fadeDimmer()` - Dimmer-Übergang

## Scripts

```bash
# Demo starten
npm run start

# Entwicklung
npm run dev
```

## Integration

Dieser DMX-Agent wird von folgenden Systemen verwendet:

- **n8n**: Workflow-Automation für Lichtsteuerung
- **Chat Bridge**: Discord/Telegram Bot-Integration
- **REST API**: HTTP-Endpunkte für externe Steuerung

## Geplante Features

- [ ] WSL2-Unterstützung mit USB-Passthrough
- [ ] Docker-Container für einfache Bereitstellung
- [ ] REST API für externe Steuerung
- [ ] Web-Interface für manuelle Bedienung
- [ ] Raspberry Pi Deployment-Scripts
- [ ] Mehrere Scheinwerfer-Unterstützung
- [ ] Szenen-Management
- [ ] MQTT-Integration

## Entwicklung

### Projekt-Struktur
```
/dmx/
├── ParLightB262.js    # Scheinwerfer-Klasse
├── index.js           # Demo/Test-Script
├── package.json       # Dependencies
└── README.MD          # Diese Datei
```

### DMX-Kanäle (Par Light B262)
| Kanal | Funktion |
|-------|----------|
| 1 | Master Dimmer |
| 2 | Rot |
| 3 | Grün |
| 4 | Blau |
| 5 | Strobe |
| 6 | Modus |
| 7 | Geschwindigkeit |

## Lizenz

ISC