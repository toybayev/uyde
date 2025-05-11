from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static

schema_view = get_schema_view(
    openapi.Info(
        title="Uyde API",
        default_version='v1',
        description="Документация REST API для проекта аренды жилья",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="support@uyde.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('uyde_core.urls')),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# 👇 Добавляем Silk и статику только в режиме отладки
if settings.DEBUG:
    import silk
    urlpatterns += [
        path('silk/', include('silk.urls', namespace='silk'))
    ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
