# 🔐 Quick Secrets Setup Guide

## Where to Save Docker Hub Secrets

### 1. Go to Repository Settings
Navigate to: `https://github.com/Ottes42/dmx-controller-agent/settings/secrets/actions`

### 2. Add Repository Secrets
Click **"New repository secret"** and add these secrets:

#### Secret #1: Docker Hub Username
- **Name**: `DOCKERHUB_USERNAME`
- **Secret**: `ottes`

#### Secret #2: Docker Hub Access Token  
- **Name**: `DOCKERHUB_TOKEN`
- **Secret**: `[Your Docker Hub Access Token]`

#### Secret #3: Codecov Token (Optional but recommended)
- **Name**: `CODECOV_TOKEN`
- **Secret**: `[Your Codecov Upload Token]`

### 3. Create Docker Hub Access Token
1. Login to [hub.docker.com](https://hub.docker.com)
2. Go to **Account Settings** → **Security** → **New Access Token**
3. Name: `GitHub Actions DMX Controller`  
4. Permissions: **Read, Write, Delete**
5. Copy the generated token and use it as `DOCKERHUB_TOKEN`

### 4. Create Codecov Upload Token
1. Login to [codecov.io](https://codecov.io) with your GitHub account
2. Navigate to your repository: `https://codecov.io/gh/Ottes42/dmx-controller-agent`
3. Go to **Settings** → **Repository Upload Token**
4. Copy the **Repository Upload Token** and use it as `CODECOV_TOKEN`

**Note**: The Codecov token enables coverage reports in CI/CD. Without it, coverage uploads may fail but builds will continue.

## 🚀 Trigger First Build

After setting up secrets, push the v1.0.0 tag:

```bash
git push origin v1.0.0
```

This will:
- ✅ Build multi-platform Docker image (amd64 + arm64)
- ✅ Push to `ottes/dmx-controller-agent:v1.0.0` 
- ✅ Push to `ottes/dmx-controller-agent:latest`
- ✅ Generate additional semantic tags (1.0, 1)

## 📋 Verify Setup

1. **Check workflow**: Go to Actions tab to see build progress
2. **Check Docker Hub**: Visit `https://hub.docker.com/r/ottes/dmx-controller-agent`
3. **Test locally**: `docker pull ottes/dmx-controller-agent:v1.0.0`

---

For complete details, see: [docs/docker-hub-setup.md](./docker-hub-setup.md)