from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework import routers
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from .views import SignUpView, LoginView

schema_view = get_schema_view(
    openapi.Info(
        title="Roof.kz API",
        default_version='v1',
        description="Roof.kz API documentation",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@roof.kz"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
)

urlpatterns = [
    path('api/signup/', SignUpView.as_view(), name='signup'),
    path('api/login/', LoginView.as_view(), name='login'),

    # Swagger UI
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-docs'),
]
