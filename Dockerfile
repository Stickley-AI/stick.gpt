# Dockerfile for stick.gpt
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# Note: In some Docker environments, npm may show SSL certificate errors
# The fallback with strict-ssl=false handles these cases
RUN npm set strict-ssl false && npm ci --omit=dev

# Copy source code
COPY . .

# Create a non-root user
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs nodejs && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Set environment variables
ENV NODE_ENV=production

# Set the entrypoint
ENTRYPOINT ["node", "/app/cli.js"]

# Default command
CMD ["--help"]
