FROM node:18-alpine
WORKDIR /app
COPY . .
RUN echo "{}" > productos.json
EXPOSE 3000
CMD ["node", "server.js"]