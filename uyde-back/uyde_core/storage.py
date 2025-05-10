from storages.backends.s3boto3 import S3Boto3Storage
import boto3
from django.conf import settings


class S3MediaStorage(S3Boto3Storage):
    bucket_name = 'media'
    location = 'items'
    file_overwrite = False
    default_acl = 'public-read'

    def url(self, name):
        """
        Генерирует правильный URL для доступа к файлу в MinIO
        """
        # Исправляем путь, если "items/" не указан в начале
        if not name.startswith('items/') and self.location:
            name = f"{self.location}/{name}"

        # Для публичного доступа просто возвращаем публичный URL
        return f"{settings.AWS_S3_CUSTOM_DOMAIN}/{self.bucket_name}/{name}"


# Создаем статичный экземпляр хранилища
minio_storage = S3MediaStorage()

