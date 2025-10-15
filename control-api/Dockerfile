# control-api/Dockerfile
# Use a stable Node LTS base
FROM node:20-bullseye

# Create app directory
WORKDIR /app

# Only copy package files first to leverage Docker cache for npm install
COPY package.json package-lock.json* ./

# Install deps (no audit/fund to speed up builds)
RUN npm ci --no-audit --no-fund

# Copy rest of app
COPY . .

# Build step if you have TypeScript / build scripts (optional)
# RUN npm run build

# Expose port (match .env PORT)
ENV PORT=3000
EXPOSE 3000

# Use a non-root user for safety (optional)
RUN useradd --user-group --create-home --shell /bin/bash appuser \
 && chown -R appuser:appuser /app
USER appuser

# Start the app
CMD ["npm", "start"]

# Healthcheck (optional): make sure app responds on /health
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://127.0.0.1:3000/health || exit 1
