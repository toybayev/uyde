import os
import random
from io import BytesIO
from django.core.files.base import ContentFile
from PIL import Image

from django.contrib.auth import get_user_model
from uyde.models import Post, Photo, Favorite, Review

User = get_user_model()

# Очистка старых данных (кроме суперпользователя)
Favorite.objects.all().delete()
Review.objects.all().delete()
Photo.objects.all().delete()
Post.objects.all().delete()
User.objects.exclude(is_superuser=True).delete()

# Пользователи
user_data = [
    ('alice', 'Alice Wonderland', 'alice@mail.com'),
    ('bob', 'Bob Builder', 'bob@mail.com'),
    ('carol', 'Carol Danvers', 'carol@mail.com'),
    ('dave', 'Dave Grohl', 'dave@mail.com'),
    ('eve', 'Eve Torres', 'eve@mail.com'),
]

users = []
for username, full_name, email in user_data:
    user = User.objects.create_user(username=username, full_name=full_name, email=email, password='test1234')
    users.append(user)

# Генератор мок-изображения
def generate_dummy_image(name='image.jpg'):
    img = Image.new('RGB', (640, 480), color=(random.randint(100,255), random.randint(100,255), random.randint(100,255)))
    buffer = BytesIO()
    img.save(buffer, format='JPEG')
    return ContentFile(buffer.getvalue(), name=name)

titles = [
    "Уютная квартира в центре",
    "Современный дом в новом районе",
    "Студия возле университета",
    "Квартира с ремонтом и мебелью",
    "Дом рядом с парком",
    "Тихий район, свежий воздух",
    "Светлая квартира в новом доме",
    "Дом для большой семьи",
    "Просторная квартира с балконом",
    "Уютный дом у озера",
]

descriptions = [
    "Просторная и светлая, рядом с остановкой и магазинами.",
    "Тихое место, свежий воздух и хорошие соседи.",
    "Недалеко от метро, отличный вариант для студентов.",
    "С ремонтом, мебелью, техникой. Заезжай и живи!",
    "Всё новое, не жили. Есть парковка и охрана.",
]

addresses = [
    "ул. Ленина 12",
    "пр. Чуй 101",
    "ул. Манаса 34",
    "ул. Тыныстанова 87",
    "ул. Ахунбаева 45",
    "ул. Боконбаева 23",
    "ул. Московская 67",
    "ул. Исанова 15",
    "ул. Жибек Жолу 120",
    "ул. Байтик Баатыра 39",
]

# Посты и связанные сущности
for i in range(10):
    owner = random.choice(users)
    post = Post.objects.create(
        owner=owner,
        type=random.choice(['rent_out', 'sell']),
        title=random.choice(titles),
        description=random.choice(descriptions),
        city="Бишкек",
        address=random.choice(addresses),
        price=random.randint(15000, 60000),
        rooms=random.randint(1, 5),
    )

    # Фото (2–4)
    for j in range(random.randint(2, 4)):
        img = generate_dummy_image(f'post_{post.id}_{j}.jpg')
        Photo.objects.create(post=post, image=img)

    # Отзывы (2–5)
    review_authors = [u for u in users if u != post.owner]
    for _ in range(random.randint(2, 5)):
        author = random.choice(review_authors)
        Review.objects.create(
            author=author,
            post=post,
            text=random.choice(["Отличное жилье!", "Немного шумно, но в целом хорошо.", "Рекомендую!"]),
            rating=random.randint(3, 5)
        )

# Избранное (по 2–4 поста на юзера)
for user in users:
    possible_posts = Post.objects.exclude(owner=user).order_by('?')
    for post in possible_posts[:random.randint(2, 4)]:
        Favorite.objects.get_or_create(seeker=user, post=post)

print("✅ Расширенные мок-данные успешно загружены.")
