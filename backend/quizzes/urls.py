from django.urls import path
from .views import quiz_list_create, quiz_detail, quiz_questions_list_create, question_detail

urlpatterns = [
    path("", quiz_list_create, name="quiz-list"),
    path("<int:pk>/", quiz_detail, name="quiz-detail"),
    path("<int:quiz_id>/questions/", quiz_questions_list_create, name="quiz-questions-list"),
    path("questions/<int:pk>/", question_detail, name="question-detail"),
]