FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Servidor de desarrollo; para producción usar `npm run build` + un servidor estático.
CMD ["npm", "run", "dev"]
