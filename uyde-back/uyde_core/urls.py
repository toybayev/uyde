from django.urls import path, include
from rest_framework_nested import routers
from . import api_views
from .api_views import RentPostList, SalePostList, ReviewViewSet

# Основной роутер
router = routers.DefaultRouter()
router.register(r'users', api_views.UserViewSet, basename='user')
router.register(r'posts', api_views.PostViewSet, basename='post')

# Вложенные роутеры
posts_router = routers.NestedDefaultRouter(router, r'posts', lookup='post')
posts_router.register(r'photos', api_views.PhotoViewSet, basename='post-photos')
posts_router.register(r'reviews', ReviewViewSet, basename='post-reviews')  # 👈 добавили это

users_router = routers.NestedDefaultRouter(router, r'users', lookup='user')
users_router.register(r'favorites', api_views.FavoriteViewSet, basename='user-favorites')
users_router.register(r'posts', api_views.UserPostViewSet, basename='user-posts')

urlpatterns = [
    path('api/register/', api_views.RegisterView.as_view(), name='register'),
    path('api/login/', api_views.LoginView.as_view(), name='login'),
    path('api/users/me/', api_views.current_user, name='current-user'),

    path('api/', include(router.urls)),
    path('api/', include(posts_router.urls)),
    path('api/', include(users_router.urls)),

    path('api/posts/rent/', RentPostList.as_view(), name='post-rent-list'),
    path('api/posts/sale/', SalePostList.as_view(), name='post-sale-list'),
]
