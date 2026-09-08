
from django.contrib import admin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "username", "role", "is_staff")
    search_fields = ("email", "username")
    list_filter = ("role", "is_staff")