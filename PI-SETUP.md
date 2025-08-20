# 🍓 Raspberry Pi Quick Setup Guide

Quick guide to deploy the DMX Controller as a service on Raspberry Pi using Docker Compose.

## Prerequisites

- Raspberry Pi with Docker and Docker Compose installed
- Enttec Open DMX USB device connected
- User added to `dialout` group for USB access

## Setup

```bash
# Clone repository
git clone https://github.com/Ottes42/dmx-controller-agent.git
cd dmx-controller-agent

# Find your DMX device
ls -la /dev/ttyUSB*
# Should show something like: /dev/ttyUSB0

# Add user to dialout group (if not already done)
sudo usermod -a -G dialout $USER

# Start the service
docker compose up -d

# Check status
docker compose logs -f dmx-controller

# Access web interface
open http://localhost:3000
```

## Service Management

```bash
# Start service
docker compose up -d

# Stop service
docker compose down

# Restart service
docker compose restart

# View logs
docker compose logs -f

# Check service status
docker compose ps
```

## Customization

Edit `docker-compose.yaml` to customize:
- USB device path (`/dev/ttyUSB0`)
- Port mapping (`3000:3000`)
- Resource limits
- Environment variables

For detailed configuration options, see [Docker Guide](docs/docker.md).