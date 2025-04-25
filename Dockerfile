FROM node:22-alpine3.21

# Create app directory
WORKDIR /usr/src/app

# Create folder
COPY tokens /usr/src/app/tokens

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port and start application
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]