
from django.contrib import admin
from .models import Attempt

@admin.register(Attempt)
class AttemptAdmin(admin.ModelAdmin):
    list_display = ("id", "student", "quiz", "score", "submitted_at")
    search_fields = ("student__email", "quiz__title")