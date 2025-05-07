# Используем официальный Python образ
FROM python:3.10-slim

# Устанавливаем зависимости системы
RUN apt-get update && apt-get install -y libpq-dev

# Настроим рабочую директорию
WORKDIR /app

# Копируем все файлы проекта в контейнер
COPY ./uyde-back /app

# Устанавливаем зависимости из requirements.txt
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Копируем переменные окружения
COPY uyde-back/.env /app/

# Открываем порт, на котором будет работать Django
EXPOSE 8000

# Запускаем сервер Django (в production лучше использовать gunicorn)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
