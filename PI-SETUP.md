# 🍓 Raspberry Pi Quick Setup Guide

Quick guide to deploy the DMX Controller as a service on Raspberry Pi using Docker Compose.

## Prerequisites

- Raspberry Pi with Docker and Docker Compose installed
- Enttec Open DMX USB device connected
- User added to `dialout` group for USB access
- Proper USB device permissions configured (see setup section below)

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

# Create udev rule for persistent USB device permissions (recommended)
echo 'KERNEL=="ttyUSB[0-9]*", GROUP="dialout", MODE="0660"' \
| sudo tee /etc/udev/rules.d/99-usb-serial.rules
sudo udevadm control --reload-rules
sudo udevadm trigger

# Apply group changes (logout/login or reboot, or use newgrp)
newgrp dialout

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

## Troubleshooting

### Permission Denied Errors

If you encounter permission errors when accessing the DMX device:

```bash
# Check current permissions
ls -la /dev/ttyUSB*

# Verify you're in the dialout group
groups $USER

# If not in dialout group, add user and restart terminal/system
sudo usermod -a -G dialout $USER

# For immediate effect without logout:
newgrp dialout
```

### USB Device Not Found

```bash
# Check if device is detected
lsusb

# Check for ttyUSB devices
ls -la /dev/ttyUSB*

# If no devices appear, check USB connection and try:
sudo dmesg | tail -10
```

The udev rule ensures consistent permissions after device reconnection or system reboot. The `group_add: ["dialout"]` in docker-compose.yaml allows the container to access devices owned by the dialout group.