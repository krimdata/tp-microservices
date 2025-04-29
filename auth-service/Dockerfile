# Build stage
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# Run stage
FROM node:20-slim
WORKDIR /app
COPY --from=builder /app .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm","start"]
