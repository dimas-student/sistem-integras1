# Build stage
FROM node:20-alpine as builder

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Development stage - includes dev dependencies for tsx
FROM node:20-alpine as dev

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma
RUN npm install

RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["npm", "run", "dev"]

# Runtime stage
FROM node:20-alpine as production

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 5000

CMD ["npm", "start"]
