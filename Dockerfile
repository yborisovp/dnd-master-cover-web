# Stage 1: Build the React app
FROM node:lts-alpine as build
WORKDIR /app

# Define the build argument (this will be provided by Coolify)
ARG REACT_APP_API_URL
# Set it as an environment variable for the build process
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

# Copy package files and install dependencies (including sass)
COPY package.json yarn.lock ./
RUN yarn add sass && yarn install

# Copy the rest of the application code
COPY . .

# Build the production bundle
RUN yarn build

# Stage 2: Serve the app with Nginx
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
