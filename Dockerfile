FROM node:24-alpine

# Set working directory
WORKDIR /app

# Create app user for security
RUN addgroup -g 1001 -S dmx && \
    adduser -u 1001 -S -G dmx dmx

# Install system dependencies (USB devices handled at runtime)

# Copy package files
COPY package*.json ./

# Install dependencies (skip prepare scripts to avoid husky)
RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force

# Copy application code
COPY src/ ./src/
COPY devices/ ./devices/
COPY public/ ./public/
COPY scripts/ ./scripts/

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