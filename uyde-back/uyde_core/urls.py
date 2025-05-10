from django.urls import path, include
from rest_framework_nested import routers
from .api_views import (
    RegisterView, LoginView, current_user,
    UserViewSet, PostViewSet,
    PhotoViewSet, FavoriteViewSet,
    UserPostViewSet, ReviewViewSet,
    RentPostList, SalePostList
)

router = routers.DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'posts', PostViewSet, basename='post')

posts_router = routers.NestedDefaultRouter(router, r'posts', lookup='post')
posts_router.register(r'photos', PhotoViewSet, basename='post-photos')
posts_router.register(r'reviews', ReviewViewSet, basename='post-reviews')

users_router = routers.NestedDefaultRouter(router, r'users', lookup='user')
users_router.register(r'favorites', FavoriteViewSet, basename='user-favorites')
users_router.register(r'posts', UserPostViewSet, basename='user-posts')

urlpatterns = [
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/users/me/', current_user, name='current-user'),

    # 👇 добавь их ЯВНО
    path('api/posts/rent/', RentPostList.as_view(), name='post-rent-list'),
    path('api/posts/sale/', SalePostList.as_view(), name='post-sale-list'),

    path('api/', include(router.urls)),
    path('api/', include(posts_router.urls)),
    path('api/', include(users_router.urls)),
]
