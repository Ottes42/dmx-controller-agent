FROM node:24-alpine

# Set working directory
WORKDIR /app

# Create app user for security
RUN groupadd -g 1001 dmx && \
    useradd -r -u 1001 -g dmx dmx

# Install system dependencies for USB access
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    udev \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application code
COPY src/ ./src/
COPY devices/ ./devices/
COPY public/ ./public/
COPY test.js ./

# Create necessary directories and set permissions
RUN mkdir -p /app/logs && \
    chown -R dmx:dmx /app

# Switch to non-root user
USER dmx

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start application
CMD ["node", "src/index.js"]