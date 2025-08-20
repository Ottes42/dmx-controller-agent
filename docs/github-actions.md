# GitHub Actions Workflows Overview

This document provides an overview of all GitHub Actions workflows added to enhance the DMX Controller Agent project's CI/CD pipeline.

## 🚀 Workflows Added

### 1. CI/CD Pipeline (`ci.yml`)
**Trigger:** Push/PR to main branches
**Purpose:** Core code quality, testing, and coverage reporting

**Jobs:**
- **Lint**: Code quality checks with Standard.js
- **Test**: Unit tests across Node.js versions (18, 20, 22) with coverage reporting
- **Build**: Application startup testing and build artifact creation
- **Security**: NPM audit and dependency vulnerability scanning

**Artifacts:**
- Coverage reports (7 days retention)
- Build artifacts (30 days retention)

**Integrations:**
- Codecov for coverage reporting
- GitHub Security tab for vulnerability alerts

### 2. Docker Build & Test (`docker.yml`)
**Trigger:** Push/PR to main branches, tags
**Purpose:** Container build, test, and registry publishing

**Features:**
- Multi-architecture builds (amd64, arm64)
- Container health testing
- Automatic tagging (branch, PR, semver)
- GHCR publishing for releases
- Build caching for performance

**Artifacts:**
- Docker images (7 days retention)

### 3. Security Scanning (`security.yml`)
**Trigger:** Push/PR + daily schedule
**Purpose:** Comprehensive security analysis

**Scans:**
- NPM dependency vulnerabilities
- CodeQL static analysis
- Docker image security (Trivy)
- Daily automated security checks

**Reports:**
- Security reports (30 days retention)
- SARIF uploads to GitHub Security tab

### 4. Release Automation (`release.yml`)
**Trigger:** Version tags, manual workflow dispatch
**Purpose:** Automated release creation and asset publishing

**Features:**
- Automatic changelog generation
- Release archive creation (tar.gz, zip)
- Docker image publishing with version tags
- Installation scripts included

### 5. Performance Monitoring (`performance.yml`)
**Trigger:** Push to main + weekly schedule
**Purpose:** Performance regression detection

**Tests:**
- API endpoint performance benchmarking
- Memory and CPU profiling
- Performance threshold monitoring
- Load testing with autocannon

**Reports:**
- Performance metrics (30 days retention)
- Profiling data (7 days retention)

### 6. Auto Labeling (`label.yml`)
**Trigger:** PR events
**Purpose:** Automated PR categorization

**Labels:**
- File-based: documentation, frontend, backend, testing, ci-cd, config
- Branch-based: feature, bugfix, hotfix, release
- Size-based: xs, s, m, l, xl (based on lines changed)

### 7. Stale Management (`stale.yml`)
**Trigger:** Daily schedule
**Purpose:** Maintain repository hygiene

**Configuration:**
- Issues: 30 days inactive → stale, 7 days → closed
- PRs: 30 days inactive → stale, 14 days → closed
- Exemptions for critical/security labels

## 🔧 Supporting Files

### Dependabot Configuration (`dependabot.yml`)
- Weekly dependency updates (Monday 9 AM)
- NPM, GitHub Actions, and Docker updates
- Automated PR creation with proper labeling

### Code Owners (`CODEOWNERS`)
- Automatic review assignment (@Ottes42)
- Critical file protection (workflows, package.json)

### Enhanced Labeler Config (`labeler.yml`)
- Comprehensive file-path based labeling
- Branch name pattern matching
- Security and configuration detection

## 📊 Benefits

### Code Quality
- ✅ Automated linting on every PR
- ✅ Multi-version Node.js testing
- ✅ Coverage tracking and reporting
- ✅ Security vulnerability scanning

### Development Speed
- ✅ NPM dependency caching
- ✅ Docker build caching
- ✅ Parallel job execution
- ✅ Artifact reuse between workflows

### Release Management
- ✅ Automated release creation
- ✅ Version tagging and changelog
- ✅ Docker image publishing
- ✅ Release asset preparation

### Monitoring & Maintenance  
- ✅ Performance regression detection
- ✅ Security scanning automation
- ✅ Stale issue/PR cleanup
- ✅ Dependency update automation

## 🎯 Usage Instructions

### For Developers
1. **Standard Development**: All checks run automatically on PR
2. **Performance Issues**: Check Performance workflow for regressions
3. **Security Alerts**: Monitor Security tab in GitHub
4. **Dependencies**: Dependabot PRs require review and testing

### For Releases
1. **Create Release**: `git tag v1.2.3 && git push origin v1.2.3`
2. **Manual Release**: Use workflow dispatch with version number
3. **Docker Images**: Automatically published to GHCR
4. **Assets**: Release archives and installation scripts included

### Monitoring
- **Coverage**: Check Codecov integration
- **Performance**: Weekly performance reports
- **Security**: Daily vulnerability scans
- **Quality**: All PRs must pass CI checks

This comprehensive workflow setup ensures high code quality, security, and maintainability while speeding up development through automation and caching! 🚀✨