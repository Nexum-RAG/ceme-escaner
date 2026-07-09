FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm config set registry https://registry.npmjs.org/ && \
    npm install --prefer-online
RUN echo "{}" > productos.json
EXPOSE 3000
CMD ["node", "server.js"]