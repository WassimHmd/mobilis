FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript files
RUN npm run build

# Expose ports for your services
EXPOSE 5000  
EXPOSE 3000  

# Run the compiled JS code
CMD ["npm", "start"]