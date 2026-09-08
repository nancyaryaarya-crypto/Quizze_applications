from django.urls import path
from . import views

urlpatterns = [

    path(
        "start/<int:quiz_id>/",
        views.start_quiz,
        name="start-quiz"
    ),

    path(
        "submit/<int:attempt_id>/",
        views.submit_quiz,
        name="submit-quiz"
    ),

    path(
        "",
        views.attempt_list,
        name="attempt-list"
    ),

    path(
        "<int:pk>/",
        views.attempt_detail,
        name="attempt-detail"
    ),
]