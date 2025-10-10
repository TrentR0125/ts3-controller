# Use official Node.js LTS (Alpine for small size)
FROM node:20-alpine

# Install bash and necessary build tools
RUN apk add --no-cache bash python3 make g++

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Install all dependencies (production + dev for TypeScript build)
RUN npm ci

# Copy all source code and public assets
COPY . .

# Build the NestJS app
RUN npm run build

# Expose API port (default 3000)
EXPOSE 3000

# Start the API (main.ts handles wizard if .env is missing)
CMD ["node", "dist/main.js"]