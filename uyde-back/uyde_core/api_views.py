from rest_framework.views import APIView
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

from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page



from .models import Post, Photo, Favorite
from .serializers import (
    RegisterSerializer, UserSerializer, PostSerializer,
    PhotoSerializer, FavoriteReadSerializer, FavoriteWriteSerializer,ReviewSerializer
)

User = get_user_model()


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]



class PostViewSet(viewsets.ModelViewSet):

    throttle_scope = 'posts'

    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = []

    @method_decorator(cache_page(60 * 15, key_prefix='post_list'))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        import time
        time.sleep(1)
        return super().get_queryset()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class UserPostViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(owner_id=self.kwargs['user_pk'])


class FavoriteViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_pk']
        return Favorite.objects.filter(seeker_id=user_id)

    def perform_create(self, serializer):
        user_id = self.kwargs['user_pk']
        user = get_object_or_404(User, pk=user_id)
        post_id = self.request.data.get('post')

        if not post_id:
            raise serializers.ValidationError({"post": "This field is required."})

        post = get_object_or_404(Post, pk=post_id)
        serializer.save(seeker=user, post=post)

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return FavoriteReadSerializer
        return FavoriteWriteSerializer


class PhotoViewSet(viewsets.ModelViewSet):
    serializer_class = PhotoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        post_id = self.kwargs['post_pk']
        return Photo.objects.filter(post_id=post_id)

    def perform_create(self, serializer):
        post_id = self.kwargs['post_pk']
        post = get_object_or_404(Post, pk=post_id)
        serializer.save(post=post)

    def get_serializer_context(self):
        return {"request": self.request}


class RentPostList(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Post.objects.filter(type='rent_out', is_active=True)


class SalePostList(ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Post.objects.filter(type='sell', is_active=True)





class ReviewViewSet(viewsets.ModelViewSet):
    throttle_scope = 'review'
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        post_id = self.kwargs.get('post_pk')  # важно: post_pk, не post_id
        return Review.objects.filter(post_id=post_id)

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_pk')
        post = Post.objects.get(id=post_id)

        if post.owner == self.request.user:
            raise ValidationError("❌ You cannot review your own post.")

        serializer.save(author=self.request.user, post=post)

