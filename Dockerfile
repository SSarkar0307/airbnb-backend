FROM node:20-alpine

WORKDIR /usr/src/app

# Install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

# run without nodemon in production

CMD ["node", "app.js"]
