# 🔗 Integration Examples

Real-world examples for integrating the DMX Controller Agent with various platforms and systems.

## 📑 Table of Contents

- [🔗 Integration Examples](#-integration-examples)
  - [📑 Table of Contents](#-table-of-contents)
  - [🏠 Home Automation](#-home-automation)
    - [Home Assistant](#home-assistant)
      - [REST Commands Configuration](#rest-commands-configuration)
      - [Automation Examples](#automation-examples)
      - [Dashboard Cards](#dashboard-cards)
  - [🤖 Chat Bots](#-chat-bots)
    - [Discord Bot](#discord-bot)
      - [Basic Bot Setup](#basic-bot-setup)
      - [Slash Commands](#slash-commands)
    - [Telegram Bot](#telegram-bot)
  - [🔄 Workflow Automation](#-workflow-automation)
    - [n8n Workflows](#n8n-workflows)
      - [Simple Color Change Workflow](#simple-color-change-workflow)
      - [Time-based Lighting Workflow](#time-based-lighting-workflow)
  - [🎮 Gaming Integration](#-gaming-integration)
    - [OBS Studio Plugin](#obs-studio-plugin)
    - [Twitch Integration](#twitch-integration)
  - [🎵 Music Integration](#-music-integration)
    - [Spotify Integration](#spotify-integration)
  - [🌐 Web Integration](#-web-integration)
    - [React Component](#react-component)
    - [Vue.js Component](#vuejs-component)
  - [📊 Monitoring \& Analytics](#-monitoring--analytics)
    - [Prometheus Metrics](#prometheus-metrics)
  - [🔒 Security Considerations](#-security-considerations)
    - [API Key Authentication](#api-key-authentication)
    - [Rate Limiting](#rate-limiting)

---

## 🏠 Home Automation

### Home Assistant

Add DMX lighting control to your Home Assistant setup:

#### REST Commands Configuration

```yaml
# configuration.yaml
rest_command:
  # Basic light control
  dmx_light_on:
    url: "http://192.168.1.100:3000/api/light/on"
    method: POST
    content_type: 'application/json'
    payload: '{"color": "{{ color }}", "intensity": {{ intensity }}}'
    
  dmx_light_off:
    url: "http://192.168.1.100:3000/api/light/off"
    method: POST
    
  dmx_set_color:
    url: "http://192.168.1.100:3000/api/light/color"
    method: POST
    content_type: 'application/json'
    payload: '{"color": "{{ color }}", "intensity": {{ intensity | default(255) }}}'
    
  # Animations
  dmx_rainbow:
    url: "http://192.168.1.100:3000/api/animation/rainbow"
    method: POST
    content_type: 'application/json'
    payload: '{"duration": {{ duration | default(5000) }}, "steps": {{ steps | default(36) }}}'
    
  dmx_pulse:
    url: "http://192.168.1.100:3000/api/animation/pulse"
    method: POST
    content_type: 'application/json'
    payload: '{"color": "{{ color }}", "minIntensity": {{ min_intensity | default(50) }}, "maxIntensity": {{ max_intensity | default(255) }}, "duration": {{ duration | default(2000) }}}'
    
  dmx_strobe:
    url: "http://192.168.1.100:3000/api/animation/strobe"
    method: POST
    content_type: 'application/json'
    payload: '{"color": "{{ color | default("white") }}", "onDuration": {{ on_duration | default(100) }}, "offDuration": {{ off_duration | default(100) }}}'
    
  dmx_stop:
    url: "http://192.168.1.100:3000/api/animation/stop"
    method: POST
```

#### Automation Examples

```yaml
# automations.yaml

# Party mode trigger
- alias: "DMX Party Mode"
  trigger:
    - platform: state
      entity_id: input_boolean.party_mode
      to: 'on'
  action:
    - service: rest_command.dmx_rainbow
      data:
        duration: 3000
        
# Goodnight routine
- alias: "DMX Goodnight"
  trigger:
    - platform: time
      at: '22:00:00'
  action:
    - service: rest_command.dmx_set_color
      data:
        color: "orange"
        intensity: 100
    - delay: '00:02:00'
    - service: rest_command.dmx_light_off

# Motion-triggered ambient lighting
- alias: "DMX Motion Light"
  trigger:
    - platform: state
      entity_id: binary_sensor.living_room_motion
      to: 'on'
  condition:
    - condition: sun
      after: sunset
  action:
    - service: rest_command.dmx_set_color
      data:
        color: "white"
        intensity: 150
```

#### Dashboard Cards

```yaml
# Lovelace card example
type: vertical-stack
cards:
  - type: horizontal-stack
    cards:
      - type: button
        name: "On"
        tap_action:
          action: call-service
          service: rest_command.dmx_light_on
          data:
            color: "white"
            intensity: 255
      - type: button
        name: "Off"
        tap_action:
          action: call-service
          service: rest_command.dmx_light_off
          
  - type: horizontal-stack
    cards:
      - type: button
        name: "Red"
        tap_action:
          action: call-service
          service: rest_command.dmx_set_color
          data:
            color: "red"
      - type: button
        name: "Blue"
        tap_action:
          action: call-service
          service: rest_command.dmx_set_color
          data:
            color: "blue"
      - type: button
        name: "Green"
        tap_action:
          action: call-service
          service: rest_command.dmx_set_color
          data:
            color: "green"
            
  - type: horizontal-stack
    cards:
      - type: button
        name: "Rainbow"
        tap_action:
          action: call-service
          service: rest_command.dmx_rainbow
          data:
            duration: 6000
      - type: button
        name: "Pulse"
        tap_action:
          action: call-service
          service: rest_command.dmx_pulse
          data:
            color: "purple"
            duration: 3000
```

---

## 🤖 Chat Bots

### Discord Bot

Create a Discord bot for lighting control:

#### Basic Bot Setup

```javascript
// discord-bot.js
const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

const DMX_API = 'http://localhost:3000/api';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    
    const args = message.content.split(' ');
    const command = args[0].toLowerCase();
    
    switch (command) {
        case '!light':
            await handleLightCommand(message, args);
            break;
        case '!rainbow':
            await handleRainbowCommand(message, args);
            break;
        case '!pulse':
            await handlePulseCommand(message, args);
            break;
        case '!strobe':
            await handleStrobeCommand(message);
            break;
        case '!stop':
            await handleStopCommand(message);
            break;
    }
});

async function handleLightCommand(message, args) {
    const color = args[1] || 'white';
    const intensity = parseInt(args[2]) || 255;
    
    try {
        const response = await fetch(`${DMX_API}/light/color`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ color, intensity })
        });
        
        const result = await response.json();
        
        if (result.success) {
            message.reply(`💡 Light set to ${color} (${intensity}/255)`);
        } else {
            message.reply(`❌ Error: ${result.error}`);
        }
    } catch (error) {
        message.reply('❌ Failed to control light');
    }
}

async function handleRainbowCommand(message, args) {
    const duration = parseInt(args[1]) || 5000;
    
    try {
        await fetch(`${DMX_API}/animation/rainbow`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ duration })
        });
        
        message.reply(`🌈 Rainbow animation started (${duration/1000}s)`);
    } catch (error) {
        message.reply('❌ Failed to start rainbow');
    }
}

client.login('YOUR_BOT_TOKEN');
```

#### Slash Commands

```javascript
// slash-commands.js
const { SlashCommandBuilder } = require('discord.js');

const commands = [
    new SlashCommandBuilder()
        .setName('dmx')
        .setDescription('Control DMX lighting')
        .addSubcommand(subcommand =>
            subcommand
                .setName('color')
                .setDescription('Set light color')
                .addStringOption(option =>
                    option.setName('color')
                        .setDescription('Color name')
                        .setRequired(true)
                        .addChoices(
                            { name: 'Red', value: 'red' },
                            { name: 'Green', value: 'green' },
                            { name: 'Blue', value: 'blue' },
                            { name: 'White', value: 'white' },
                            { name: 'Purple', value: 'purple' }
                        ))
                .addIntegerOption(option =>
                    option.setName('intensity')
                        .setDescription('Brightness (0-255)')
                        .setMinValue(0)
                        .setMaxValue(255)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('rainbow')
                .setDescription('Start rainbow animation')
                .addIntegerOption(option =>
                    option.setName('duration')
                        .setDescription('Animation duration in seconds')
                        .setMinValue(1)
                        .setMaxValue(30)))
];
```

### Telegram Bot

```javascript
// telegram-bot.js
const TelegramBot = require('node-telegram-bot-api');
const fetch = require('node-fetch');

const bot = new TelegramBot('YOUR_BOT_TOKEN', { polling: true });
const DMX_API = 'http://localhost:3000/api';

// Color keyboard
const colorKeyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                { text: '🔴 Red', callback_data: 'color_red' },
                { text: '🟢 Green', callback_data: 'color_green' },
                { text: '🔵 Blue', callback_data: 'color_blue' }
            ],
            [
                { text: '⚪ White', callback_data: 'color_white' },
                { text: '🟡 Yellow', callback_data: 'color_yellow' },
                { text: '🟣 Purple', callback_data: 'color_purple' }
            ],
            [
                { text: '🌈 Rainbow', callback_data: 'rainbow' },
                { text: '💗 Pulse', callback_data: 'pulse' },
                { text: '⚡ Strobe', callback_data: 'strobe' }
            ],
            [
                { text: '🛑 Stop', callback_data: 'stop' }
            ]
        ]
    }
};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '🎭 Welcome to DMX Controller!\nUse /light to control lighting.', colorKeyboard);
});

bot.onText(/\/light/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, '💡 Choose a color or effect:', colorKeyboard);
});

bot.on('callback_query', async (callbackQuery) => {
    const message = callbackQuery.message;
    const data = callbackQuery.data;
    
    if (data.startsWith('color_')) {
        const color = data.replace('color_', '');
        
        try {
            await fetch(`${DMX_API}/light/color`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ color })
            });
            
            bot.answerCallbackQuery(callbackQuery.id, `Light set to ${color}!`);
        } catch (error) {
            bot.answerCallbackQuery(callbackQuery.id, 'Error controlling light');
        }
        
    } else if (data === 'rainbow') {
        try {
            await fetch(`${DMX_API}/animation/rainbow`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ duration: 5000 })
            });
            
            bot.answerCallbackQuery(callbackQuery.id, '🌈 Rainbow started!');
        } catch (error) {
            bot.answerCallbackQuery(callbackQuery.id, 'Error starting rainbow');
        }
    }
    // Handle other callbacks...
});
```

---

## 🔄 Workflow Automation

### n8n Workflows

#### Simple Color Change Workflow

```json
{
  "name": "DMX Color Control",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "url": "http://localhost:3000/api/light/color",
        "jsonBody": true,
        "body": {
          "color": "{{ $json.color }}",
          "intensity": "{{ $json.intensity || 255 }}"
        }
      },
      "name": "Set DMX Color",
      "type": "n8n-nodes-base.httpRequest"
    }
  ]
}
```

#### Time-based Lighting Workflow  

```json
{
  "name": "Daily Lighting Schedule",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [
            { "field": "cronExpression", "value": "0 7 * * *" }
          ]
        }
      },
      "name": "Morning Trigger",
      "type": "n8n-nodes-base.cron"
    },
    {
      "parameters": {
        "url": "http://localhost:3000/api/animation/fade",
        "jsonBody": true,
        "body": {
          "color": "orange",
          "duration": 5000,
          "easing": "outQuart"
        }
      },
      "name": "Morning Light",
      "type": "n8n-nodes-base.httpRequest"
    }
  ]
}
```

---

## 🎮 Gaming Integration

### OBS Studio Plugin

```javascript
// obs-dmx-plugin.js
const OBSWebSocket = require('obs-websocket-js');
const fetch = require('node-fetch');

const obs = new OBSWebSocket();
const DMX_API = 'http://localhost:3000/api';

obs.connect({ address: 'localhost:4444' });

obs.on('StreamStarted', async () => {
    // Green light when streaming starts
    await fetch(`${DMX_API}/light/color`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color: 'green', intensity: 200 })
    });
});

obs.on('StreamStopped', async () => {
    // Red pulse when stream ends
    await fetch(`${DMX_API}/animation/pulse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            color: 'red', 
            minIntensity: 50, 
            maxIntensity: 255, 
            duration: 1000 
        })
    });
});

obs.on('SceneChanged', async (data) => {
    // Different colors for different scenes
    const sceneColors = {
        'Game Scene': 'blue',
        'Chat Scene': 'purple',
        'BRB Scene': 'orange'
    };
    
    const color = sceneColors[data.sceneName] || 'white';
    
    await fetch(`${DMX_API}/light/color`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color })
    });
});
```

### Twitch Integration

```javascript
// twitch-integration.js
const tmi = require('tmi.js');
const fetch = require('node-fetch');

const client = new tmi.Client({
    channels: ['your_channel']
});

const DMX_API = 'http://localhost:3000/api';

client.connect();

client.on('subscription', async (channel, username, method, message, userstate) => {
    // Rainbow celebration for new subscribers
    await fetch(`${DMX_API}/animation/rainbow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: 10000, steps: 50 })
    });
});

client.on('cheer', async (channel, userstate, message) => {
    const bits = userstate.bits;
    
    if (bits >= 1000) {
        // Epic strobe for big cheers
        await fetch(`${DMX_API}/animation/strobe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ color: 'white', onDuration: 50, offDuration: 50 })
        });
        
        setTimeout(async () => {
            await fetch(`${DMX_API}/animation/stop`, { method: 'POST' });
        }, 5000);
    } else if (bits >= 100) {
        // Pulse for medium cheers
        await fetch(`${DMX_API}/animation/pulse`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ color: 'purple', duration: 2000 })
        });
    }
});
```

---

## 🎵 Music Integration

### Spotify Integration

```javascript
// spotify-dmx.js
const SpotifyWebApi = require('spotify-web-api-node');
const fetch = require('node-fetch');

const spotifyApi = new SpotifyWebApi({
    clientId: 'your_client_id',
    clientSecret: 'your_client_secret',
    redirectUri: 'http://localhost:8888/callback'
});

const DMX_API = 'http://localhost:3000/api';

// Genre-based color mapping
const genreColors = {
    'rock': 'red',
    'pop': 'purple',
    'electronic': 'cyan',
    'jazz': 'orange',
    'classical': 'white',
    'hip-hop': 'magenta',
    'indie': 'green'
};

async function syncWithCurrentTrack() {
    try {
        const data = await spotifyApi.getMyCurrentPlayingTrack();
        const track = data.body.item;
        
        if (track) {
            const artists = await spotifyApi.getArtist(track.artists[0].id);
            const genres = artists.body.genres;
            
            // Find matching color for genre
            let color = 'white';
            for (const genre of genres) {
                for (const [genreKey, genreColor] of Object.entries(genreColors)) {
                    if (genre.includes(genreKey)) {
                        color = genreColor;
                        break;
                    }
                }
                if (color !== 'white') break;
            }
            
            // Get track energy for intensity
            const features = await spotifyApi.getAudioFeaturesForTrack(track.id);
            const energy = features.body.energy;
            const intensity = Math.floor(energy * 200 + 55); // 55-255 range
            
            await fetch(`${DMX_API}/light/color`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ color, intensity })
            });
            
            // Pulse with the beat (using tempo)
            const tempo = features.body.tempo;
            const pulseDuration = (60 / tempo) * 1000 * 2; // 2 beats per pulse
            
            await fetch(`${DMX_API}/animation/pulse`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    color,
                    minIntensity: intensity * 0.7,
                    maxIntensity: intensity,
                    duration: pulseDuration
                })
            });
        }
    } catch (error) {
        console.error('Spotify sync error:', error);
    }
}

// Check every 30 seconds
setInterval(syncWithCurrentTrack, 30000);
```

---

## 🌐 Web Integration

### React Component

```jsx
// DMXController.jsx
import React, { useState, useEffect } from 'react';

const DMXController = () => {
    const [status, setStatus] = useState(null);
    const [colors] = useState(['red', 'green', 'blue', 'white', 'purple', 'orange']);
    
    const API_BASE = 'http://localhost:3000/api';
    
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch(`${API_BASE}/status`);
                const data = await response.json();
                setStatus(data);
            } catch (error) {
                console.error('Failed to fetch status:', error);
            }
        };
        
        fetchStatus();
        const interval = setInterval(fetchStatus, 2000);
        return () => clearInterval(interval);
    }, []);
    
    const setColor = async (color) => {
        try {
            await fetch(`${API_BASE}/light/color`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ color })
            });
        } catch (error) {
            console.error('Failed to set color:', error);
        }
    };
    
    const startAnimation = async (type, params = {}) => {
        try {
            await fetch(`${API_BASE}/animation/${type}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params)
            });
        } catch (error) {
            console.error('Failed to start animation:', error);
        }
    };
    
    return (
        <div className="dmx-controller">
            <h2>DMX Lighting Control</h2>
            
            {status && (
                <div className="status">
                    <p>Animation: {status.isAnimating ? 'Active' : 'None'}</p>
                    <p>Brightness: {status.currentState.masterDimmer}</p>
                    <p>RGB: {status.currentState.red}, {status.currentState.green}, {status.currentState.blue}</p>
                </div>
            )}
            
            <div className="color-buttons">
                {colors.map(color => (
                    <button 
                        key={color}
                        onClick={() => setColor(color)}
                        style={{ backgroundColor: color, color: color === 'white' ? 'black' : 'white' }}
                    >
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                    </button>
                ))}
            </div>
            
            <div className="animation-buttons">
                <button onClick={() => startAnimation('rainbow', { duration: 5000 })}>
                    🌈 Rainbow
                </button>
                <button onClick={() => startAnimation('pulse', { color: 'purple' })}>
                    💗 Pulse
                </button>
                <button onClick={() => startAnimation('strobe', { color: 'white' })}>
                    ⚡ Strobe
                </button>
                <button onClick={() => startAnimation('stop')}>
                    🛑 Stop
                </button>
            </div>
        </div>
    );
};

export default DMXController;
```

### Vue.js Component

```vue
<!-- DMXController.vue -->
<template>
  <div class="dmx-controller">
    <h2>DMX Lighting Control</h2>
    
    <div v-if="status" class="status">
      <p>Animation: {{ status.isAnimating ? 'Active' : 'None' }}</p>
      <p>Brightness: {{ status.currentState.masterDimmer }}</p>
      <p>RGB: {{ status.currentState.red }}, {{ status.currentState.green }}, {{ status.currentState.blue }}</p>
    </div>
    
    <div class="color-buttons">
      <button 
        v-for="color in colors" 
        :key="color"
        @click="setColor(color)"
        :style="{ backgroundColor: color, color: color === 'white' ? 'black' : 'white' }"
      >
        {{ color.charAt(0).toUpperCase() + color.slice(1) }}
      </button>
    </div>
    
    <div class="animation-buttons">
      <button @click="startAnimation('rainbow', { duration: 5000 })">🌈 Rainbow</button>
      <button @click="startAnimation('pulse', { color: 'purple' })">💗 Pulse</button>
      <button @click="startAnimation('strobe', { color: 'white' })">⚡ Strobe</button>
      <button @click="startAnimation('stop')">🛑 Stop</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DMXController',
  data() {
    return {
      status: null,
      colors: ['red', 'green', 'blue', 'white', 'purple', 'orange'],
      API_BASE: 'http://localhost:3000/api'
    }
  },
  mounted() {
    this.fetchStatus();
    this.statusInterval = setInterval(this.fetchStatus, 2000);
  },
  beforeDestroy() {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
  },
  methods: {
    async fetchStatus() {
      try {
        const response = await fetch(`${this.API_BASE}/status`);
        this.status = await response.json();
      } catch (error) {
        console.error('Failed to fetch status:', error);
      }
    },
    async setColor(color) {
      try {
        await fetch(`${this.API_BASE}/light/color`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ color })
        });
      } catch (error) {
        console.error('Failed to set color:', error);
      }
    },
    async startAnimation(type, params = {}) {
      try {
        await fetch(`${this.API_BASE}/animation/${type}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        });
      } catch (error) {
        console.error('Failed to start animation:', error);
      }
    }
  }
}
</script>
```

---

## 📊 Monitoring & Analytics

### Prometheus Metrics

```javascript
// metrics.js
const prometheus = require('prom-client');
const express = require('express');

// Create custom metrics
const lightStateGauge = new prometheus.Gauge({
    name: 'dmx_light_state',
    help: 'Current light state (0=off, 1=on)',
    labelNames: ['device_id']
});

const animationCounter = new prometheus.Counter({
    name: 'dmx_animations_total',
    help: 'Total number of animations started',
    labelNames: ['animation_type', 'device_id']
});

const colorChangeCounter = new prometheus.Counter({
    name: 'dmx_color_changes_total',
    help: 'Total number of color changes',
    labelNames: ['color', 'device_id']
});

// Integration with existing DMX controller
function updateMetrics(parLight) {
    const state = parLight.currentState;
    const isOn = state.masterDimmer > 0 ? 1 : 0;
    
    lightStateGauge.set({ device_id: 'par_light_1' }, isOn);
}

// Expose metrics endpoint
const app = express();
app.get('/metrics', (req, res) => {
    res.set('Content-Type', prometheus.register.contentType);
    res.end(prometheus.register.metrics());
});

module.exports = { updateMetrics, animationCounter, colorChangeCounter };
```

---

## 🔒 Security Considerations

### API Key Authentication

```javascript
// secure-api.js
const express = require('express');
const crypto = require('crypto');

const API_KEYS = new Set([
    'your-secure-api-key-here',
    'another-key-for-different-client'
]);

const authenticateAPI = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (!apiKey || !API_KEYS.has(apiKey)) {
        return res.status(401).json({
            success: false,
            error: 'Invalid or missing API key'
        });
    }
    
    next();
};

// Apply to all API routes
app.use('/api', authenticateAPI);
```

### Rate Limiting

```javascript
// rate-limiting.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        error: 'Too many requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false
});

const animationLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit animation requests
    message: {
        success: false,
        error: 'Animation rate limit exceeded'
    }
});

app.use('/api', limiter);
app.use('/api/animation', animationLimiter);
```

---

This comprehensive integration guide covers the most common use cases and platforms for DMX lighting control integration! 🎭✨
