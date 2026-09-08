from django.contrib import admin

from .models import Topic


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "created_by", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("name",)
