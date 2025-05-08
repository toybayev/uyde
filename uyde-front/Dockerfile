# Development environment for React
FROM node:18

WORKDIR /app

# Копируем только package файлы — чтобы кэшировать установку зависимостей
COPY package*.json ./

# Установка зависимостей строго по lock-файлу
RUN npm ci

# Копируем всё остальное после установки — чтобы слои Docker не пересобирались лишний раз
COPY . .

# Открываем порт, на котором работает dev-сервер
EXPOSE 3000

# Запускаем dev-сервер
CMD ["npm", "start"]
