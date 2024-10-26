# Use an official Node.js image as the base image
FROM node:16-alpine AS build

# Set the working directory in the container
WORKDIR /

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire React app to the container's working directory
COPY . .

# Build the React app for production
RUN npm run build

# Use Nginx to serve the built app
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 5173 to the outside world
EXPOSE 5173

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
