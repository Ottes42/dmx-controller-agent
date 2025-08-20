# 🎪 Effects & Easing Guide

Complete guide to all available lighting effects and easing functions.

## 🌈 Animation Types

### 1. Fade Animation

Smooth color transitions between two colors

```javascript
parLight.fadeToColor('blue', 2000, 'outQuart');
```

**Use Cases:**

- 🌅 Sunrise/sunset simulation
- 🎭 Theater mood changes
- 🏠 Ambient lighting transitions

**Parameters:**

- `color`: Target color name
- `duration`: Animation time in milliseconds
- `easing`: Transition curve (see below)

---

### 2. Color Cycle

Sequential transitions through multiple colors

```javascript
parLight.startColorCycle(['red', 'green', 'blue'], 1000, 'inOutSine');
```

**Use Cases:**

- 🎉 Party lighting
- 🚨 Alert systems
- 🌈 Rainbow effects (with many colors)

**Parameters:**

- `colors`: Array of color names (optional, defaults to all colors)
- `stepDuration`: Time per color in milliseconds  
- `easing`: Transition curve between colors

---

### 3. Pulse Animation

Rhythmic brightness variation while maintaining color

```javascript
parLight.startPulse('purple', 30, 255, 2000, 'inOutSine');
```

**Use Cases:**

- 💓 Heartbeat simulation
- 🫁 Breathing rhythm
- ⚠️ Status indicators

**Parameters:**

- `color`: Pulse color
- `minIntensity`: Lowest brightness (0-255)
- `maxIntensity`: Highest brightness (0-255)
- `duration`: Complete pulse cycle time
- `easing`: Brightness curve

**Visual Representation:**

```
Brightness
    255 ●     ●     ●
        ╱ ╲   ╱ ╲   ╱ ╲
       ╱   ╲ ╱   ╲ ╱   ╲
     30     ●     ●     ●
        └─2s─┘
```

---

### 4. Strobe Effect  

Rapid on/off flashing

```javascript
parLight.startStrobe('white', 100, 100);
```

**Use Cases:**

- 🪩 Disco lighting
- ⚡ Lightning simulation  
- 🚨 Emergency signals

**Parameters:**

- `color`: Flash color
- `onDuration`: Light-on time in milliseconds
- `offDuration`: Light-off time in milliseconds

**Visual Representation:**

```
Intensity
  255 ██  ██  ██  ██
      ││  ││  ││  ││
    0 ││  ││  ││  ││
      └┘  └┘  └┘  └┘
      100ms cycles
```

---

### 5. Rainbow Animation

Smooth progression through entire color spectrum

```javascript
parLight.startRainbow(5000, 36);
```

**Use Cases:**  

- 🌈 Pride displays
- 🎨 Color showcases
- ✨ Magical effects

**Parameters:**

- `duration`: Complete rainbow cycle time
- `steps`: Number of color divisions (more = smoother)

**Color Progression:**

```
Red → Orange → Yellow → Green → Cyan → Blue → Purple → Red
```

---

### 6. Dimmer Fade

Brightness transitions without color change

```javascript
parLight.fadeDimmer(128, 2000, 'outQuart');
```

**Use Cases:**

- 🌅 Sunrise simulation (brightness only)
- 🎬 Theater dimming
- 💤 Sleep mode transitions

**Parameters:**

- `targetIntensity`: Final brightness (0-255)
- `duration`: Fade time in milliseconds
- `easing`: Brightness curve

---

## 📈 Easing Functions Explained

Easing functions control the **speed curve** of animations, making them feel natural and engaging.

### Linear Family

```
linear: ────────────────→
```

Constant speed throughout

- **Best for**: Mechanical movements, technical displays
- **Feel**: Robotic, precise

### Quadratic Family (Quad)

```
inQuad:    ╭────────────→    (slow → fast)
outQuad:   ──────────╮      (fast → slow)  
inOutQuad: ╭─────────╮      (slow → fast → slow)
```

Gentle acceleration/deceleration

- **Best for**: Natural movements, UI animations
- **Feel**: Smooth, organic

### Cubic/Quartic/Quintic

**Like Quad but with increasing intensity:**

```
Quad:    gentle curve    ╭─╮
Cubic:   moderate curve  ╭──╮  
Quartic: strong curve    ╭───╮
Quintic: very strong     ╭────╮
```

### Sine Family

```
inOutSine: ∿∿∿∿∿∿∿∿∿∿∿
```

**Sinusoidal curves - very natural**

- **Best for**: Breathing, organic pulsing
- **Feel**: Living, rhythmic

### Exponential (Expo)

```
inExpo:  ╲
         ╲
         ╲_______________
         
outExpo: ________________
                       ╱
                     ╱
                   ╱
```

Dramatic acceleration

- **Best for**: Explosions, dramatic reveals
- **Feel**: Sudden, impactful

### Circular (Circ)

```
Quarter-circle curves
```

Smooth, rounded transitions

- **Best for**: Flowing movements
- **Feel**: Fluid, graceful

### Back Family

```
inBack:    ╲╱─────────→    (overshoots backward first)
outBack:   ────────→╱╲     (overshoots forward at end)
inOutBack: ╲╱──────╱╲      (overshoots both directions)
```

"Spring-loaded" effect

- **Best for**: Playful UI, cartoon effects
- **Feel**: Bouncy, energetic

### Elastic Family

```
inElastic:    ∿∿∿∿─────→    (wobbles before moving)
outElastic:   ─────→∿∿∿∿    (wobbles after arriving)
inOutElastic: ∿∿──────∿∿    (wobbles at both ends)
```

Rubber band effect

- **Best for**: Fun interactions, attention-grabbing
- **Feel**: Springy, playful

### Bounce Family  

```
inBounce:    ╲╱╲╱╲╱───→    (bounces before moving)
outBounce:   ───→╲╱╲╱╲╱    (bounces after arriving)  
inOutBounce: ╲╱──────╲╱    (bounces at both ends)
```

**Ball bouncing effect**

- **Best for**: Game-like interactions
- **Feel**: Lively, entertaining

## 💡 Easing Recommendations by Effect

### 🌈 Fade Animations

| Scenario | Recommended Easing | Why |
|----------|-------------------|-----|
| **Sunset** | `outQuart` | Natural light fading |
| **Sunrise** | `inQuart` | Natural light building |
| **Color mixing** | `inOutSine` | Smooth, organic blend |
| **Alert state** | `outExpo` | Dramatic attention grab |
| **Mood lighting** | `outCubic` | Gentle, relaxing |

### 💗 Pulse Animations  

| Scenario | Recommended Easing | Why |
|----------|-------------------|-----|
| **Heartbeat** | `inOutSine` | Natural cardiac rhythm |
| **Breathing** | `inOutSine` | Lung expansion/contraction |
| **Meditation** | `inOutCubic` | Calm, centered feeling |
| **Excitement** | `inOutElastic` | Energetic, bouncy |
| **Warning** | `inOutQuad` | Clear, noticeable |

### 🌈 Color Cycles

| Scenario | Recommended Easing | Why |
|----------|-------------------|-----|
| **Party mode** | `inOutBack` | Fun, bouncy transitions |
| **Rainbow** | `linear` | Even color distribution |
| **Meditation** | `inOutSine` | Flowing, peaceful |
| **Gaming** | `inOutElastic` | Dynamic, exciting |

### 🎛️ Dimmer Fades

| Scenario | Recommended Easing | Why |
|----------|-------------------|-----|
| **Sleep mode** | `outQuart` | Mimics natural drowsiness |
| **Wake up** | `inExpo` | Energizing brightness |
| **Theater** | `inOutCubic` | Professional, smooth |
| **Emergency** | `inBounce` | Attention-getting |

## 🎨 Creative Effect Combinations

### 🌅 Realistic Sunrise

```javascript
// Start dark
parLight.setColor('off');

// Warm glow appears
parLight.fadeToColor('orange', 3000, 'inQuart');

// Brightens to warm white  
setTimeout(() => {
    parLight.fadeDimmer(200, 4000, 'inCubic');
}, 3000);

// Final bright daylight
setTimeout(() => {
    parLight.fadeToColor('white', 2000, 'outQuad');
}, 7000);
```

### 🌊 Ocean Waves

```javascript
// Blue pulse with wave-like rhythm
parLight.startPulse('cyan', 80, 220, 3000, 'inOutSine');

// Occasional "wave crash" - brighter flash
setInterval(() => {
    parLight.fadeDimmer(255, 200, 'outExpo');
    setTimeout(() => {
        parLight.fadeDimmer(150, 800, 'inQuart');
    }, 300);
}, 8000);
```

### 🔥 Campfire Effect

```javascript
// Base warm glow
parLight.setColor('orange', 180);

// Random flickers
function flicker() {
    const intensity = Math.random() * 100 + 120; // 120-220
    const duration = Math.random() * 300 + 100;  // 100-400ms
    
    parLight.fadeDimmer(intensity, duration, 'inOutElastic');
    
    setTimeout(flicker, Math.random() * 500 + 200);
}
flicker();
```

### ⚡ Lightning Storm

```javascript
function lightning() {
    // Sudden bright flash
    parLight.fadeToColor('white', 50, 'outExpo');
    
    // Quick fade to dim
    setTimeout(() => {
        parLight.fadeDimmer(20, 200, 'inQuart');
    }, 100);
    
    // Optional second flash
    if (Math.random() > 0.7) {
        setTimeout(() => {
            parLight.fadeDimmer(255, 30, 'linear');
            setTimeout(() => {
                parLight.fadeDimmer(20, 400, 'outQuad');
            }, 50);
        }, 400);
    }
    
    // Next lightning in 2-10 seconds
    setTimeout(lightning, Math.random() * 8000 + 2000);
}
```

### 🎪 Circus Mode

```javascript
// Rapid color changes with bouncy transitions
const circusColors = ['red', 'yellow', 'blue', 'green', 'magenta'];
parLight.startColorCycle(circusColors, 600, 'inOutBounce');

// Add occasional strobe bursts
setInterval(() => {
    parLight.stopAnimation();
    parLight.startStrobe('white', 80, 80);
    
    setTimeout(() => {
        parLight.stopAnimation();
        parLight.startColorCycle(circusColors, 600, 'inOutBounce');
    }, 2000);
}, 15000);
```

## 🔧 Performance Tips

### Smooth Animations

- **Minimum duration**: 500ms for visible easing effects
- **Sweet spot**: 1000-3000ms for most effects  
- **Maximum**: 10000ms+ for very slow transitions

### CPU Optimization

- Use `linear` easing for long-running effects
- Avoid complex easing (`elastic`, `bounce`) for rapid cycles
- Stop animations when not needed

### Visual Quality

- **Color cycles**: Use 4-8 colors for best flow
- **Rainbow**: 36+ steps for smooth spectrum
- **Pulse**: `inOutSine` almost always looks best

### Timing Guidelines

```javascript
// Good timing examples
parLight.fadeToColor('red', 1500, 'outQuart');     // Natural
parLight.startPulse('blue', 50, 255, 2500, 'inOutSine');  // Relaxing
parLight.startColorCycle(['red','green','blue'], 800);     // Dynamic
parLight.startRainbow(6000, 36);                   // Smooth spectrum

// Avoid these (too fast/slow)
parLight.fadeToColor('red', 100, 'outBounce');     // Too fast for bounce
parLight.startPulse('blue', 50, 255, 30000);       // Uncomfortably slow
```

Remember: The best effects feel **natural** and serve the **mood** you want to create! 🎭✨
