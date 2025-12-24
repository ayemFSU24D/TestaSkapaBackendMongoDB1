#-------------------------- hur man bygger EN container------------------------------
#-------------------------- Dockerfile = byggrecept------------------------------

#------------Dockerfile svarar på frågan: Hur skapar jag en Docker-image av min app?
#Den beskriver: vilket OS / runtime (t.ex. Node.js),hur koden kopieras in, hur beroenden installeras, hur appen startas
#---------Och senare receptet användas av pipeline(den alltid använder Dockerfile) om man använder pipeline för deployment------------------------



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
