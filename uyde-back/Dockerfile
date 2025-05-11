# Используем официальный Python образ
FROM python:3.10-slim

# Устанавливаем только необходимые зависимости
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Настроим рабочую директорию
WORKDIR /app

# Копируем только requirements.txt для кэширования слоя с зависимостями
COPY ./uyde-back/requirements.txt .

# Устанавливаем зависимости включая gunicorn
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install gunicorn

# Копируем код проекта
COPY ./uyde-back /app

# Создаем директорию для статических файлов
RUN mkdir -p /app/staticfiles

# Открываем порт
EXPOSE 8000

# Запускаем через gunicorn вместо runserver
CMD ["sh", "-c", "python manage.py collectstatic --noinput && gunicorn 'uyde-back.wsgi:application' --bind 0.0.0.0:8000 --workers 3"]