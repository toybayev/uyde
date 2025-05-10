from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Post, Photo, Favorite

User = get_user_model()


# 🔹 Пользователь
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'phone', 'role']


# 🔹 Регистрация
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'full_name', 'phone', 'role']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class PhotoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Photo
        fields = '__all__'

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None


class PostSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    photos = PhotoSerializer(many=True, read_only=True)  # 👈 сюда прилетают фото по related_name='photos'

    class Meta:
        model = Post
        fields = '__all__'
        read_only_fields = ('owner',)


# 🔹 Избранное — для чтения (GET)
class FavoriteReadSerializer(serializers.ModelSerializer):
    post = PostSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = '__all__'


# 🔹 Избранное — для записи (POST/DELETE)
class FavoriteWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'
        read_only_fields = ('seeker',)

# serializers.py
from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Review
        fields = ['id', 'author', 'author_username', 'post', 'text', 'rating', 'created_at']
        read_only_fields = ['author', 'created_at', 'post']

