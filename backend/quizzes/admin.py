from django.contrib import admin
from .models import Quiz, Question, Option


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "topic",
        "total_marks",
        "passing_marks",
        "time_limit",
        "is_active",
        "created_by",
    )
    list_filter = ("topic", "is_active")
    search_fields = ("title",)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "quiz",
        "question_text",
        "marks",
    )
    search_fields = ("question_text",)
    list_filter = ("quiz",)


@admin.register(Option)
class OptionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "question",
        "option_text",
        "is_correct",
    )
    list_filter = ("is_correct",)
    search_fields = ("option_text",)
