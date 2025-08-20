# 🐳 Docker Deployment Guide

Complete guide for deploying the DMX Controller Agent using Docker and Docker Compose.

## 📑 Table of Contents

- [🐳 Docker Deployment Guide](#-docker-deployment-guide)
  - [📑 Table of Contents](#-table-of-contents)
  - [🚀 Quick Start](#-quick-start)
  - [🐳 Docker Image](#-docker-image)
  - [🔧 Docker Compose Examples](#-docker-compose-examples)
    - [Basic Setup](#basic-setup)
    - [Production Setup with Reverse Proxy](#production-setup-with-reverse-proxy)
    - [Development Setup](#development-setup)
    - [Multi-Device Setup](#multi-device-setup)
  - [📱 Platform-Specific Configuration](#-platform-specific-configuration)
    - [Linux](#linux)
    - [Windows](#windows)
    - [Raspberry Pi](#raspberry-pi)
  - [🔌 USB Device Access](#-usb-device-access)
  - [📊 Monitoring \& Logging](#-monitoring--logging)
  - [🔒 Security Considerations](#-security-considerations)
  - [🐛 Troubleshooting](#-troubleshooting)
  - [⚡ Performance Optimization](#-performance-optimization)

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/your-username/dmx.git
cd dmx

# Build and run with Docker Compose
docker-compose up -d

# Access web interface
open http://localhost:3000
```

## 🐳 Docker Image

Build the image locally:

```bash
# Build image
docker build -t dmx-controller .

# Run container
docker run -d \
  --name dmx-controller \
  --device=/dev/ttyUSB0:/dev/ttyUSB0 \
  -p 3000:3000 \
  -e DMX_DEVICE=/dev/ttyUSB0 \
  dmx-controller
```

## 🔧 Docker Compose Examples

### Basic Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  dmx-controller:
    build: .
    container_name: dmx-controller
    ports:
      - "3000:3000"
    devices:
      - "/dev/ttyUSB0:/dev/ttyUSB0"
    environment:
      - PORT=3000
      - DMX_DEVICE=/dev/ttyUSB0
      - NODE_ENV=production
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Production Setup with Reverse Proxy

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  dmx-controller:
    build: .
    container_name: dmx-controller
    expose:
      - "3000"
    devices:
      - "/dev/ttyUSB0:/dev/ttyUSB0"
    environment:
      - PORT=3000
      - DMX_DEVICE=/dev/ttyUSB0
      - NODE_ENV=production
    volumes:
      - ./logs:/app/logs
      - /etc/localtime:/etc/localtime:ro
    restart: unless-stopped
    networks:
      - dmx-network
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    container_name: dmx-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - dmx-controller
    restart: unless-stopped
    networks:
      - dmx-network

  # Optional: Monitoring
  prometheus:
    image: prom/prometheus:latest
    container_name: dmx-prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus-data:/prometheus
    restart: unless-stopped
    networks:
      - dmx-network

  grafana:
    image: grafana/grafana:latest
    container_name: dmx-grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
    restart: unless-stopped
    networks:
      - dmx-network

networks:
  dmx-network:
    driver: bridge

volumes:
  prometheus-data:
  grafana-data:
```

### Development Setup

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  dmx-controller-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: dmx-controller-dev
    ports:
      - "3000:3000"
      - "9229:9229"  # Node.js debugger
    devices:
      - "/dev/ttyUSB0:/dev/ttyUSB0"
    environment:
      - PORT=3000
      - DMX_DEVICE=/dev/ttyUSB0
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules
      - ./logs:/app/logs
    restart: unless-stopped
    command: npm run dev
```

### Multi-Device Setup

```yaml
# docker-compose.multi.yml
version: '3.8'

services:
  dmx-stage-left:
    build: .
    container_name: dmx-stage-left
    ports:
      - "3001:3000"
    devices:
      - "/dev/ttyUSB0:/dev/ttyUSB0"
    environment:
      - PORT=3000
      - DMX_DEVICE=/dev/ttyUSB0
      - DEVICE_NAME=stage-left
    volumes:
      - ./logs/stage-left:/app/logs
    restart: unless-stopped
    networks:
      - dmx-network

  dmx-stage-right:
    build: .
    container_name: dmx-stage-right
    ports:
      - "3002:3000"
    devices:
      - "/dev/ttyUSB1:/dev/ttyUSB0"
    environment:
      - PORT=3000
      - DMX_DEVICE=/dev/ttyUSB0
      - DEVICE_NAME=stage-right
    volumes:
      - ./logs/stage-right:/app/logs
    restart: unless-stopped
    networks:
      - dmx-network

  # Central control interface
  dmx-manager:
    image: nginx:alpine
    container_name: dmx-manager
    ports:
      - "8080:80"
    volumes:
      - ./manager/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./manager/html:/usr/share/nginx/html:ro
    depends_on:
      - dmx-stage-left
      - dmx-stage-right
    restart: unless-stopped
    networks:
      - dmx-network

networks:
  dmx-network:
    driver: bridge
```

## 📱 Platform-Specific Configuration

### Linux

```bash
# Find USB device
lsusb
ls -la /dev/ttyUSB*

# Add user to dialout group
sudo usermod -a -G dialout $USER

# Docker compose
docker-compose -f docker-compose.yml up -d
```

### Windows

```yaml
# docker-compose.windows.yml
version: '3.8'

services:
  dmx-controller:
    build: .
    container_name: dmx-controller
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - DMX_DEVICE=COM5  # Windows COM port
      - NODE_ENV=production
    volumes:
      - type: bind
        source: ./logs
        target: /app/logs
    restart: unless-stopped
    # Note: USB passthrough to Windows containers is limited
    # Consider using Docker Desktop with WSL2 backend
```

### Raspberry Pi

```yaml
# docker-compose.pi.yml
version: '3.8'

services:
  dmx-controller:
    build:
      context: .
      dockerfile: Dockerfile.arm64
    container_name: dmx-controller-pi
    ports:
      - "3000:3000"
    devices:
      - "/dev/ttyUSB0:/dev/ttyUSB0"
    environment:
      - PORT=3000
      - DMX_DEVICE=/dev/ttyUSB0
      - NODE_ENV=production
    volumes:
      - ./logs:/app/logs
      - /etc/localtime:/etc/localtime:ro
    restart: unless-stopped
    # Optimize for Pi's limited resources
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M
```

## 🔌 USB Device Access

Grant container access to USB devices:

```bash
# Method 1: Specific device
docker run --device=/dev/ttyUSB0:/dev/ttyUSB0 dmx-controller

# Method 2: All USB devices (less secure)
docker run --privileged -v /dev:/dev dmx-controller

# Method 3: udev rules for persistent device names
# Create /etc/udev/rules.d/99-dmx.rules:
SUBSYSTEM=="tty", ATTRS{idVendor}=="0403", ATTRS{idProduct}=="6001", SYMLINK+="dmx-interface"
```

## 📊 Monitoring & Logging

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  dmx-controller:
    build: .
    container_name: dmx-controller
    # ... other config ...
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  # Log aggregation
  fluentd:
    image: fluent/fluentd:latest
    container_name: dmx-fluentd
    volumes:
      - ./fluentd/conf:/fluentd/etc
      - ./logs:/var/log/dmx
    ports:
      - "24224:24224"

  # Metrics collection
  node-exporter:
    image: prom/node-exporter:latest
    container_name: dmx-node-exporter
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--collector.filesystem.ignored-mount-points=^/(sys|proc|dev|host|etc)($$|/)'
```

## 🔒 Security Considerations

```yaml
# Secure production setup
version: '3.8'

services:
  dmx-controller:
    build: .
    container_name: dmx-controller
    ports:
      - "127.0.0.1:3000:3000"  # Only localhost
    environment:
      - NODE_ENV=production
      - SECURE_HEADERS=true
    # Run as non-root user (already in Dockerfile)
    user: "1001:1001"
    # Read-only filesystem
    read_only: true
    tmpfs:
      - /tmp
    # Security options
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - CAP_DAC_OVERRIDE  # For device access
```

## 🐛 Troubleshooting

```bash
# Check container logs
docker-compose logs dmx-controller

# Interactive shell access
docker-compose exec dmx-controller /bin/sh

# Check USB device permissions
docker-compose exec dmx-controller ls -la /dev/ttyUSB0

# Test DMX device access
docker-compose exec dmx-controller node -e "
const fs = require('fs');
try {
  fs.accessSync('/dev/ttyUSB0', fs.constants.R_OK | fs.constants.W_OK);
  console.log('Device accessible');
} catch (err) {
  console.error('Device not accessible:', err.message);
}
"

# Health check
curl http://localhost:3000/api/health

# Performance monitoring
docker stats dmx-controller
```

## ⚡ Performance Optimization

```yaml
# Optimized production setup
version: '3.8'

services:
  dmx-controller:
    build: .
    container_name: dmx-controller
    # Resource limits
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
        reservations:
          cpus: '0.1'
          memory: 128M
    # Shared memory for better performance
    shm_size: 64m
    # Optimize Node.js
    environment:
      - NODE_OPTIONS=--max-old-space-size=128
      - UV_THREADPOOL_SIZE=4
    # Restart policy
    restart: unless-stopped
```

**Quick Commands:**

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Restart service
docker-compose restart dmx-controller

# Update and restart
docker-compose pull && docker-compose up -d

# Clean up
docker-compose down
docker system prune -f
```

---

**[⬆ Back to Main README](../README.MD)**