# Этап 1: Сборка React-приложения
FROM node:18-alpine as builder
WORKDIR /app
COPY ./uyde-front/package*.json ./
RUN npm ci
COPY ./uyde-front/ ./
RUN npm run build

# Этап 2: Настройка Nginx с собранным приложением
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

