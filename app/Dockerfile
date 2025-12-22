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
