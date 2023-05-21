FROM node:16

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 9010
CMD [ "npm", "run", "serve" ]
