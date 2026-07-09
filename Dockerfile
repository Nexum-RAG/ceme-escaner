FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install --production=false
RUN echo "{}" > productos.json
EXPOSE 3000
CMD ["node", "server.js"]
