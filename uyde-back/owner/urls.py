from django.urls import path
from .views import HousePostAPIView



urlpatterns = [
    path('post/',HousePostAPIView.as_view(),name='house-post'),
]