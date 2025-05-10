from django.contrib import admin
from .models import User, Post, Photo, Favorite
from django.utils.html import format_html

@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ('id', 'post', 'preview')
    readonly_fields = ['preview']

    def preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-height: 100px;" />', obj.image.url)
        return "-"
    preview.short_description = "Preview"

admin.site.register(User)
admin.site.register(Post)
admin.site.register(Favorite)
