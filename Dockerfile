# Stage 1: Build with Yarn
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package manifests separately for better cache utilization
COPY package.json yarn.lock ./

# Pass in your API URL at build time
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Install dependencies (frozen lockfile ensures repeatability)
RUN yarn install --frozen-lockfile

# Copy source files and build
COPY . .
RUN yarn build

# Stage 2: Serve with Nginx
FROM nginx:stable-alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy the build artifacts from the builder stage
COPY --from=builder /app/build /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
