from django.urls import path, include
from rest_framework_nested import routers
from . import api_views

# Главный роутер
router = routers.DefaultRouter()
router.register(r'users', api_views.UserViewSet, basename='user')
router.register(r'posts', api_views.PostViewSet, basename='post')

# Вложенные роутеры
posts_router = routers.NestedDefaultRouter(router, r'posts', lookup='post')
posts_router.register(r'photos', api_views.PhotoViewSet, basename='post-photos')

users_router = routers.NestedDefaultRouter(router, r'users', lookup='user')
users_router.register(r'favorites', api_views.FavoriteViewSet, basename='user-favorites')

urlpatterns = [
    path('api/register/', api_views.RegisterView.as_view(), name='register'),
    path('api/login/', api_views.LoginView.as_view(), name='login'),
    path('api/', include(router.urls)),
    path('api/', include(posts_router.urls)),
    path('api/', include(users_router.urls)),
]
