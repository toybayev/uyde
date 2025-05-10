from rest_framework.views import APIView
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.core.cache import cache
from rest_framework.response import Response
from rest_framework import status, viewsets, serializers
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView
from rest_framework import permissions
from .models import Review
from rest_framework.exceptions import ValidationError

from .models import Post, Photo, Favorite
from .serializers import (
    RegisterSerializer, UserSerializer, PostSerializer,
    PhotoSerializer, FavoriteReadSerializer, FavoriteWriteSerializer,ReviewSerializer
)

User = get_user_model()


# 🔐 Регистрация
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# 🔐 Логин
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)

        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_404_NOT_FOUND)

        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=status.HTTP_200_OK)


# 👤 Получить текущего пользователя
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


# 👤 Список пользователей
class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @method_decorator(cache_page(60*15))  # Кэшируем на 15 минут
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

# 📮 Посты
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        cache_key = 'posts_all'
        queryset = cache.get(cache_key)
        if not queryset:
            queryset = Post.objects.all()
            cache.set(cache_key, queryset, timeout=60 * 15)  # 15 минут
        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        cache.delete('posts_all')


    # 📮 Посты одного пользователя (для /users/{id}/posts/)
class UserPostViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_pk = self.kwargs['user_pk']
        cache_key = f'user_posts_{user_pk}'
        queryset = cache.get(cache_key)
        if not queryset:
            queryset = Post.objects.filter(owner_id=user_pk)
            cache.set(cache_key, queryset, timeout=60*15)  # 15 минут
        return queryset


# ⭐ Избранные
class FavoriteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_pk']
        cache_key = f'favorites_for_user_{user_id}'
        favorites = cache.get(cache_key)

        if not favorites:
            favorites = Favorite.objects.filter(seeker_id=user_id)
            cache.set(cache_key, favorites, timeout=60 * 15)  # Кэшируем на 15 минут
        return favorites

    def perform_create(self, serializer):
        user_id = self.kwargs['user_pk']
        user = get_object_or_404(User, pk=user_id)
        post_id = self.request.data.get('post')

        if not post_id:
            raise serializers.ValidationError({"post": "This field is required."})

        post = get_object_or_404(Post, pk=post_id)
        serializer.save(seeker=user, post=post)
        # Инвалидируем кэш при добавлении в избранное
        cache.delete(f'favorites_for_user_{user_id}')
        # Также инвалидируем кэш для счетчика избранного у поста
        cache.delete(f'post_favorites_count_{post_id}')

    def perform_destroy(self, instance):
        user_id = self.kwargs['user_pk']
        post_id = instance.post.id
        instance.delete()
        # Инвалидируем кэш при удалении из избранного
        cache.delete(f'favorites_for_user_{user_id}')
        cache.delete(f'post_favorites_count_{post_id}')

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return FavoriteReadSerializer
        return FavoriteWriteSerializer


# 📷 Фото
class PhotoViewSet(viewsets.ModelViewSet):
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        post_id = self.kwargs['post_pk']
        cache_key = f'photos_for_post_{post_id}'
        photos = cache.get(cache_key)

        if not photos:
            photos = Photo.objects.filter(post_id=post_id)
            cache.set(cache_key, photos, timeout=60 * 30)  # Кэшируем на 30 минут
        return photos

    def perform_create(self, serializer):
        post_id = self.kwargs['post_pk']
        post = get_object_or_404(Post, pk=post_id)
        serializer.save(post=post)
        # Инвалидируем кэш при добавлении новой фотографии
        cache.delete(f'photos_for_post_{post_id}')

    def perform_update(self, serializer):
        post_id = self.kwargs['post_pk']
        serializer.save()
        # Инвалидируем кэш при обновлении фотографии
        cache.delete(f'photos_for_post_{post_id}')

    def perform_destroy(self, instance):
        post_id = self.kwargs['post_pk']
        instance.delete()
        # Инвалидируем кэш при удалении фотографии
        cache.delete(f'photos_for_post_{post_id}')

    def get_serializer_context(self):
        return {"request": self.request}


# 🏠 Отдельные списки
class RentPostList(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    @method_decorator(cache_page(60 * 30))  # Кэшируем на 30 минут
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        cache_key = 'rent_posts'
        queryset = cache.get(cache_key)
        if not queryset:
            queryset = Post.objects.filter(type='rent_out', is_active=True)
            cache.set(cache_key, queryset, timeout=60 * 30)  # 30 минут
        return queryset


class SalePostList(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    @method_decorator(cache_page(60 * 30))  # Кэшируем на 30 минут
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        cache_key = 'sale_posts'
        queryset = cache.get(cache_key)
        if not queryset:
            queryset = Post.objects.filter(type='sell', is_active=True)
            cache.set(cache_key, queryset, timeout=60 * 30)  # 30 минут
        return queryset


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_pk = self.kwargs.get('post_pk')
        cache_key = f'reviews_for_post_{post_pk}'
        queryset = cache.get(cache_key)
        if not queryset:
            queryset = Review.objects.filter(post_id=post_pk)
            cache.set(cache_key, queryset, timeout=60*30)  # 30 минут
        return queryset

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_pk')
        post = Post.objects.get(id=post_id)

        if post.owner == self.request.user:
            raise ValidationError("❌ You cannot review your own post.")

        serializer.save(author=self.request.user, post=post)
        cache.delete(f'reviews_for_post_{post_id}')  # Инвалидируем кэш
