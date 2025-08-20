let currentIntensity = 255;
let selectedColor = 'white';

// Color definitions for UI
const colorDefinitions = {
    'red': '#ff0000',
    'green': '#00ff00',
    'blue': '#0000ff',
    'white': '#ffffff',
    'yellow': '#ffff00',
    'cyan': '#00ffff',
    'magenta': '#ff00ff',
    'orange': '#ff7f00',
    'purple': '#7f00ff',
    'off': '#000000'
};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadColors();
    setupEventListeners();
    startStatusUpdater();
});

async function loadColors() {
    try {
        const response = await fetch('/api/colors');
        const data = await response.json();
        
        createColorGrid(data.colors);
        populateColorSelects(data.colors);
    } catch (error) {
        console.error('Error loading colors:', error);
    }
}

function createColorGrid(colors) {
    const colorGrid = document.getElementById('colorGrid');
    
    colors.forEach(color => {
        const colorBtn = document.createElement('div');
        colorBtn.className = 'color-btn';
        colorBtn.style.backgroundColor = colorDefinitions[color];
        colorBtn.textContent = color.toUpperCase().slice(0, 3);
        colorBtn.onclick = () => selectColor(color);
        colorGrid.appendChild(colorBtn);
    });
}

function populateColorSelects(colors) {
    const selects = ['fadeColor', 'pulseColor'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        select.innerHTML = '';
        
        colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color;
            option.textContent = color.charAt(0).toUpperCase() + color.slice(1);
            select.appendChild(option);
        });
    });
}

function setupEventListeners() {
    // Fade duration slider
    document.getElementById('fadeDuration').oninput = function(e) {
        document.getElementById('fadeDurationValue').textContent = (e.target.value / 1000).toFixed(1) + 's';
    };
    
    // Pulse duration slider
    document.getElementById('pulseDuration').oninput = function(e) {
        updatePulseDuration(e.target.value);
    };
}

async function selectColor(color) {
    selectedColor = color;
    
    // Update active color button
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    await apiCall('/api/light/color', {
        color: color,
        intensity: currentIntensity
    });
}

async function turnOn() {
    await apiCall('/api/light/on', {
        intensity: currentIntensity,
        color: selectedColor
    });
}

async function turnOff() {
    await apiCall('/api/light/off', {});
}

async function updateDimmer(value) {
    document.getElementById('dimmerValue').textContent = value;
    await apiCall('/api/light/dimmer', { value: parseInt(value) });
}

function updateIntensity(value) {
    currentIntensity = parseInt(value);
    document.getElementById('intensityValue').textContent = value;
}

function updatePulseMin(value) {
    document.getElementById('pulseMinValue').textContent = value;
}

function updatePulseMax(value) {
    document.getElementById('pulseMaxValue').textContent = value;
}

function updatePulseDuration(value) {
    document.getElementById('pulseDurationValue').textContent = (value / 1000).toFixed(1) + 's';
}

function updateStrobeSpeed(value) {
    document.getElementById('strobeSpeedValue').textContent = value + 'ms';
}

async function startFade() {
    const color = document.getElementById('fadeColor').value;
    const duration = parseInt(document.getElementById('fadeDuration').value);
    const easing = document.getElementById('fadeEasing').value;
    
    await apiCall('/api/animation/fade', {
        color: color,
        duration: duration,
        easing: easing
    });
}

async function startPulse() {
    const color = document.getElementById('pulseColor').value;
    const minIntensity = parseInt(document.getElementById('pulseMin').value);
    const maxIntensity = parseInt(document.getElementById('pulseMax').value);
    const duration = parseInt(document.getElementById('pulseDuration').value);
    
    await apiCall('/api/animation/pulse', {
        color: color,
        minIntensity: minIntensity,
        maxIntensity: maxIntensity,
        duration: duration
    });
}

async function startRainbow() {
    await apiCall('/api/animation/rainbow', {
        duration: 5000,
        steps: 36
    });
}

async function startColorCycle() {
    await apiCall('/api/animation/cycle', {
        stepDuration: 1000
    });
}

async function startStrobe() {
    const speed = parseInt(document.getElementById('strobeSpeed').value);
    
    await apiCall('/api/animation/strobe', {
        color: 'white',
        onDuration: speed,
        offDuration: speed
    });
}

async function stopAnimation() {
    await apiCall('/api/animation/stop', {});
}

async function apiCall(endpoint, data = null) {
    try {
        const options = {
            method: data ? 'POST' : 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(endpoint, options);
        const result = await response.json();
        
        if (result.success) {
            updateStatus('✅ ' + result.message, 'success');
        } else {
            updateStatus('❌ ' + result.error, 'error');
        }
        
        return result;
    } catch (error) {
        console.error('API call failed:', error);
        updateStatus('❌ Verbindungsfehler', 'error');
    }
}

function updateStatus(message, type) {
    const statusText = document.getElementById('statusText');
    const statusIndicator = document.getElementById('statusIndicator');
    
    statusText.textContent = message;
    statusIndicator.style.color = type === 'success' ? '#4CAF50' : '#f44336';
    
    setTimeout(() => {
        statusText.textContent = 'Bereit';
        statusIndicator.style.color = '#4CAF50';
    }, 3000);
}

async function startStatusUpdater() {
    setInterval(async () => {
        try {
            const response = await fetch('/api/status');
            const status = await response.json();
            
            document.getElementById('animationStatus').textContent = 
                status.isAnimating ? 'Aktiv' : 'Keine';
            document.getElementById('currentDimmer').textContent = status.currentState.masterDimmer;
            document.getElementById('currentRGB').textContent = 
                `${status.currentState.red}, ${status.currentState.green}, ${status.currentState.blue}`;
        } catch (error) {
            console.error('Status update failed:', error);
        }
    }, 2000);
}