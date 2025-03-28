FROM node:19-alpine AS first
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
FROM first AS final
RUN npm install --production
COPY . .
CMD ["node","server.js"]
