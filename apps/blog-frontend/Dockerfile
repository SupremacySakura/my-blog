# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm config set registry https://registry.npmmirror.com/
RUN npm install

# Copy source code
COPY . .

# Build args
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 2: Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy necessary files
# Copy package.json for npm start
COPY --from=builder /app/package.json ./package.json
# Copy public assets
COPY --from=builder /app/public ./public
# Copy build output
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
# Copy node_modules (production only would be better, but we need next)
COPY --from=builder /app/node_modules ./node_modules
# Copy config
COPY --from=builder /app/next.config.ts ./

# Set user
USER nextjs

EXPOSE 3000

# Start command
CMD ["npx", "next", "start", "-p", "3000"]
