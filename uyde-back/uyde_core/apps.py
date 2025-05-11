from django.apps import AppConfig


class UydeCoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'uyde_core'

    def ready(self):
        from . import signals
