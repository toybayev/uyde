
from django.contrib.auth.models import AbstractUser
from django.db import models

from .storage import minio_storage


class User(AbstractUser):
    full_name = models.CharField(max_length=255, blank=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=50, blank=True, null=True)

    def __str__(self):
        return self.username

from django.contrib.auth import get_user_model

User = get_user_model()

class Post(models.Model):
    TYPE_CHOICES = [
        ('rent_out', 'Сдам'),
        ('sell', 'Продам'),
    ]

    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='rent_out')

    title = models.CharField(max_length=255)
    description = models.TextField()
    city = models.CharField(max_length=100)
    address = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    rooms = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_type_display()} – {self.title}"



class Photo(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='photos')

    image = models.ImageField(upload_to='', storage=minio_storage, blank=True, null=True)


    def __str__(self):
        return f"Photo for Post ID {self.post_id}"


class Favorite(models.Model):
    seeker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('seeker', 'post')  # Один пользователь — один пост в избранном

    def __str__(self):
        return f"{self.seeker} -> {self.post}"



# models.py

from django.conf import settings
from .models import Post

class Review(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reviews')
    text = models.TextField()
    rating = models.PositiveIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.author} on {self.post}"
