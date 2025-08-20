# 🐧 WSL Setup Guide - DMX Controller

Guide for setting up the DMX Controller Agent in Windows Subsystem for Linux (WSL) with USB device passthrough.

## 📑 Table of Contents

- [🐧 WSL Setup Guide - DMX Controller](#-wsl-setup-guide---dmx-controller)
  - [📑 Table of Contents](#-table-of-contents)
  - [🎯 Overview](#-overview)
  - [📋 Prerequisites](#-prerequisites)
  - [🔧 Step-by-Step Setup](#-step-by-step-setup)
    - [1. Install USB/IP for Windows](#1-install-usbip-for-windows)
    - [2. Find Your DMX Device](#2-find-your-dmx-device)
    - [3. Attach USB Device to WSL](#3-attach-usb-device-to-wsl)
    - [4. Configure WSL Kernel Modules](#4-configure-wsl-kernel-modules)
    - [5. Verify Device Access](#5-verify-device-access)
    - [6. Install DMX Controller](#6-install-dmx-controller)
  - [🔍 Troubleshooting](#-troubleshooting)
    - [Device Not Found in WSL](#device-not-found-in-wsl)
    - [Permission Denied Errors](#permission-denied-errors)
    - [USB Device Disappears](#usb-device-disappears)
    - [WSL Configuration Issues](#wsl-configuration-issues)
  - [⚙️ Environment Configuration](#️-environment-configuration)
  - [🚀 Running the Application](#-running-the-application)
  - [📝 Notes](#-notes)
    - [Automating USB Attachment](#automating-usb-attachment)

## 🎯 Overview

This guide helps you set up the DMX Controller Agent in WSL2 with USB device passthrough for the Enttec Open DMX USB interface.

## 📋 Prerequisites

- **Windows 11** (recommended) or Windows 10 version 2004 and higher
- **WSL2** installed and configured
- **Ubuntu 20.04** or newer in WSL
- **Administrator privileges** on Windows
- **Enttec Open DMX USB** or compatible interface

## 🔧 Step-by-Step Setup

### 1. Install USB/IP for Windows

In Windows PowerShell/Command Prompt **as Administrator**:

```powershell
# Install usbipd-win using winget
winget install usbipd-win

# Alternative: Download from GitHub
# https://github.com/dorssel/usbipd-win/releases
```

**Restart your computer** after installation.

### 2. Find Your DMX Device

In Windows PowerShell **as Administrator**:

```powershell
# List all USB devices
usbipd list

# Look for your DMX interface, typically shows as:
# BUSID  VID:PID    DEVICE                          STATE
# 1-4    0403:6001  USB Serial Port                 Not shared
# or
# 1-4    0403:6001  FTDI USB Serial Device          Not shared
```

**Note the BUSID** of your DMX device (e.g., `1-4`).

### 3. Attach USB Device to WSL

In Windows PowerShell **as Administrator**:

```powershell
# Share the USB device (replace 1-4 with your BUSID)
usbipd bind --busid 1-4

# Attach device to WSL (replace 1-4 with your BUSID)
usbipd attach --wsl --busid 1-4

# Verify attachment
usbipd list
# Should show "Attached - Ubuntu" or similar
```

### 4. Configure WSL Kernel Modules

In your **WSL terminal**:

```bash
# Check if device is recognized
lsusb
# Should show: Bus 001 Device 002: ID 0403:6001 Future Technology Devices...

# Create/edit WSL configuration
sudo nano /etc/wsl.conf

# Add the following content:
```

Add this configuration to `/etc/wsl.conf`:

```ini
[boot]
command = "modprobe ftdi_sio"

[interop]
enabled = true

[user]
default = yourusername
```

**Restart WSL** from Windows PowerShell:

```powershell
# Shutdown WSL
wsl --shutdown

# Start WSL again
wsl
```

### 5. Verify Device Access

In your **WSL terminal**:

```bash
# Check if tty device appears
ls -la /dev/ttyUSB*
# Should show: /dev/ttyUSB0 (or similar)

# Check device permissions
ls -la /dev/ttyUSB0
# Should show: crw-rw---- 1 root dialout

# Add your user to dialout group
sudo usermod -a -G dialout $USER

# Apply group changes (logout/login or restart WSL)
wsl --shutdown
# Then restart WSL
```

### 6. Install DMX Controller

In your **WSL terminal**:

```bash
# Clone repository
git clone https://github.com/Ottes42/dmx-controller-agent.git
cd dmx-controller-agent

# Run automated setup
bash scripts/setup-dev.sh

# Set environment variable
export DMX_DEVICE=/dev/ttyUSB0

# Test the setup
npm test
```

## 🔍 Troubleshooting

### Device Not Found in WSL

```bash
# Check USB devices
lsusb

# Check kernel modules
lsmod | grep ftdi
lsmod | grep usbserial

# Manually load modules if needed
sudo modprobe ftdi_sio
sudo modprobe usbserial
```

### Permission Denied Errors

```bash
# Check device permissions
ls -la /dev/ttyUSB0

# Add user to dialout group
sudo usermod -a -G dialout $USER

# Or temporary permission fix
sudo chmod 666 /dev/ttyUSB0
```

### USB Device Disappears

```bash
# In Windows PowerShell (Administrator):
# Re-attach the device
usbipd attach --wsl --busid 1-4

# Check WSL kernel ring buffer
dmesg | tail -20
```

### WSL Configuration Issues

```bash
# Check WSL configuration
cat /etc/wsl.conf

# Restart WSL completely
# In Windows PowerShell:
wsl --shutdown
wsl
```

## ⚙️ Environment Configuration

Create `.env` file in project root:

```bash
# WSL-specific configuration
PORT=3000
DMX_DEVICE=/dev/ttyUSB0
NODE_ENV=development
DEBUG=dmx*

# Optional: If using different device
# DMX_DEVICE=/dev/ttyUSB1
```

## 🚀 Running the Application

```bash
# Start development server
npm run dev

# The server will be accessible from Windows at:
# http://localhost:3000
```

**Access from Windows**: The web interface will be accessible from your Windows browser at `http://localhost:3000` thanks to WSL2's networking.

## 📝 Notes

- **USB/IP Persistence**: USB devices need to be re-attached after Windows reboot
- **WSL Networking**: Port 3000 is automatically forwarded to Windows
- **Performance**: WSL2 has excellent performance for Node.js applications
- **Development**: All Node.js development tools work normally in WSL
- **File Access**: Edit files from Windows using VS Code with WSL extension

### Automating USB Attachment

Create a PowerShell script for automatic device attachment:

```powershell
# attach-dmx.ps1 (run as Administrator)
$BUSID = "1-4"  # Replace with your device's BUSID
usbipd attach --wsl --busid $BUSID
Write-Host "DMX device attached to WSL"
```

---

**Need help?** Check the main [Development Guide](development.md) for additional troubleshooting steps.

**[⬆ Back to Top](#-wsl-setup-guide---dmx-controller)**
