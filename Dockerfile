FROM quay.io/pcdc/node-lts-alpine:latest as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build  
