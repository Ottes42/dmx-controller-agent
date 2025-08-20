# 🐳 Docker Hub Deployment Setup

This document explains how to configure Docker Hub secrets for automated builds and deployments.

## 📋 Prerequisites

1. **Docker Hub Account**: Create an account at [hub.docker.com](https://hub.docker.com)
2. **Docker Hub Repository**: Create a repository named `dmx-controller-agent`
3. **Access Token**: Generate a Docker Hub access token

## 🔐 Setting up Docker Hub Access Token

### Step 1: Create Docker Hub Access Token

1. Login to Docker Hub
2. Go to **Account Settings** → **Security** 
3. Click **New Access Token**
4. Name: `GitHub Actions DMX Controller`
5. Access permissions: **Read, Write, Delete**
6. Click **Generate**
7. **Copy the token immediately** (it won't be shown again)

### Step 2: Configure GitHub Repository Secrets

Navigate to your GitHub repository: `https://github.com/Ottes42/dmx-controller-agent`

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**

Add these two secrets:

#### DOCKERHUB_USERNAME
- **Name**: `DOCKERHUB_USERNAME`
- **Secret**: `ottes` (your Docker Hub username)

#### DOCKERHUB_TOKEN  
- **Name**: `DOCKERHUB_TOKEN`
- **Secret**: `[paste the access token you copied]`

## 🏷️ Image Tags & Versioning

The workflow automatically creates these tags:

| Trigger | Docker Tag | Example |
|---------|------------|---------|
| `main` branch push | `latest` | `ottes/dmx-controller-agent:latest` |
| Version tag push | `v1.0.0`, `1.0.0`, `1.0`, `1` | `ottes/dmx-controller-agent:v1.0.0` |
| Pull request | `pr-123` | `ottes/dmx-controller-agent:pr-123` |

## 🚀 Triggering Builds

### Automatic Triggers
- **Push to main/master**: Builds and pushes with `latest` tag
- **Create version tag**: Builds and pushes with version tags
- **Pull Request**: Builds but doesn't push (test only)

### Manual Trigger
- Go to **Actions** → **Docker Build & Push** → **Run workflow**

## 📦 Using the Docker Image

### Pull Latest
```bash
docker pull ottes/dmx-controller-agent:latest
```

### Pull Specific Version
```bash
docker pull ottes/dmx-controller-agent:v1.0.0
```

### Run Container
```bash
docker run -d \
  --name dmx-controller \
  --device=/dev/ttyUSB0:/dev/ttyUSB0 \
  -p 3000:3000 \
  -e DMX_DEVICE=/dev/ttyUSB0 \
  ottes/dmx-controller-agent:latest
```

## 🔒 Security Best Practices

### Access Token Security
- **Never commit tokens to code**
- **Use repository secrets only**
- **Rotate tokens regularly** (every 6-12 months)
- **Minimum required permissions** (Read, Write, Delete for image management)

### Container Security
- **Non-root user**: Image runs as user `dmx` (uid 1001)
- **Minimal attack surface**: Alpine Linux base image
- **Health checks**: Built-in health monitoring
- **Read-only filesystem**: Can be run with `--read-only` flag

### Production Deployment
```bash
# Secure production deployment
docker run -d \
  --name dmx-controller \
  --device=/dev/ttyUSB0:/dev/ttyUSB0 \
  -p 127.0.0.1:3000:3000 \
  --read-only \
  --tmpfs /tmp \
  --security-opt no-new-privileges:true \
  --cap-drop ALL \
  --cap-add CAP_DAC_OVERRIDE \
  -e NODE_ENV=production \
  ottes/dmx-controller-agent:v1.0.0
```

## 🐛 Troubleshooting

### Build Failures
1. **Check secrets**: Verify `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` are set
2. **Token permissions**: Ensure token has Read, Write, Delete permissions
3. **Repository name**: Confirm Docker Hub repo exists as `ottes/dmx-controller-agent`

### Authentication Errors
```bash
# Test credentials locally
echo $DOCKERHUB_TOKEN | docker login --username ottes --password-stdin
```

### Multi-platform Build Issues
The workflow builds for both `linux/amd64` and `linux/arm64`. If you need to disable ARM64:

```yaml
platforms: linux/amd64  # Remove ,linux/arm64
```

## 📊 Monitoring Builds

- **GitHub Actions**: Monitor builds at `/actions`  
- **Docker Hub**: View images at `https://hub.docker.com/r/ottes/dmx-controller-agent`
- **Build artifacts**: Check the Actions summary for build details

---

**Next Steps**: After configuring secrets, the v1.0.0 tag is ready. Push it to trigger the first build:

```bash
git push origin v1.0.0
```

Or create and push a new version:

```bash
git tag v1.0.1
git push origin v1.0.1
```