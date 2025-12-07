FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application sources
COPY . .

# Ensure non-root user for better security
RUN chown -R node:node /usr/src/app
USER node


# development	Loggar mer, hot-reload, mindre optimering 
# production	Optimerad, mindre loggar, inga dev-dependencies körs
# test	Testmiljö, mockar ofta DB och API:er
ENV NODE_ENV=production 

# The app listens on port 3000 by default (see index.js)
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]




//---------------------------min ny via chatten---------------------
    Samma Dockerfile fungerar både lokalt och i Azure

# Basimage
FROM node:20

# Skapa arbetskatalog
WORKDIR /app

# Kopiera package.json först för caching
COPY package*.json ./

# Installera dependencies
RUN npm install

# Kopiera all kod
COPY . .

# ENV NODE_ENV=production   # development	Loggar mer, hot-reload, mindre optimering 
                            # production	Optimerad, mindre loggar, inga dev-dependencies körs
                            # test	Testmiljö, mockar ofta DB och API:er


# Exponera port 3000
EXPOSE 3000

# Starta appen. Mer standart(fungerar även med ändringar i package.json som startinstruktioner)
CMD ["npm", "start"] 

