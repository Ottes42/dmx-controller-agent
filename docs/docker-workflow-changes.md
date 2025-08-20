# Docker Workflow Changes

## Summary

Modified the Docker CI/CD workflows to meet the requirement that Docker builds should always run but pushes should only happen when creating tags/releases. Master branch remains the development state.

## Changes Made

### 1. Modified `docker.yml` (GitHub Container Registry)
- **Before**: Pushed to GHCR on every push to main/master branches
- **After**: Only builds and tests, never pushes (removed push step entirely)
- **Purpose**: This workflow is now purely for validation

### 2. Modified `docker-build-push.yml` (Docker Hub)
- **Before**: Pushed to Docker Hub on every push to main/master branches
- **After**: Only pushes on tag creation (`startsWith(github.ref, 'refs/tags/')`)
- **Changes**:
  - Login to Docker Hub only when pushing (on tags)
  - Push condition changed from `github.event_name != 'pull_request'` to `startsWith(github.ref, 'refs/tags/')`
  - Test Docker image on non-tag builds (for validation)
  - Updated summary to show correct push status

### 3. Preserved `release.yml`
- No changes needed
- Already correctly publishes Docker images only on tag/release events
- Publishes to GitHub Container Registry (GHCR) as part of release process

## New Workflow Behavior

| Event | docker.yml (GHCR) | docker-build-push.yml (Docker Hub) | release.yml (GHCR) |
|-------|-------------------|-------------------------------------|-------------------|
| **Push to main/master** | ✅ Build only | ✅ Build only | ❌ No action |
| **Pull Request** | ✅ Build & test | ✅ Build & test | ❌ No action |
| **Tag/Release (v*)** | ✅ Build only | ✅ Build & push | ✅ Build & push |

## Benefits

1. **✅ Always Build**: Docker images are built on every push/PR for validation
2. **✅ Release-only Push**: Docker images are only pushed to registries on tag creation
3. **✅ Master as Dev**: Master branch pushes only build but don't release images
4. **✅ Dual Registry**: Tags release to both Docker Hub and GitHub Container Registry
5. **✅ Continuous Validation**: All builds are tested regardless of push behavior

## Testing

- All 94 existing tests continue to pass
- YAML syntax validation confirmed
- Workflow logic verified for both build and push conditions