FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN echo "{}" > productos.json
EXPOSE 3000
CMD ["node", "server.js"]