# Use Node.js LTS version as base image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy only package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies and PM2 globally
RUN npm install && npm install -g pm2

# Copy rest of the application
COPY . .

# Expose app port (you can change this if needed)
EXPOSE 5003

# Run the application using PM2 in fork mode
CMD ["pm2-runtime", "index.js"]
