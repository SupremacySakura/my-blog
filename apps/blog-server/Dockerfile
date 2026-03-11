FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies including devDependencies for build
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build:ts

# Prune dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 5050

# Start command (using fastify-cli via npx or node_modules)
# Using dist/app.js directly with fastify
CMD ["npx", "fastify", "start", "-l", "info", "-P", "-a", "0.0.0.0", "-p", "5050", "dist/app.js"]
