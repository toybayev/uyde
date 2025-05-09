from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, get_user_model
from .models import Post, Photo, Favorite
from .serializers import *
from django.shortcuts import get_object_or_404

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


class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


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
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    from .serializers import UserSerializer
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
