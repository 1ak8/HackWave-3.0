FROM mcr.microsoft.com/playwright:v1.50.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV PORT=5000
EXPOSE 5000

CMD ["node", "server.js"]
