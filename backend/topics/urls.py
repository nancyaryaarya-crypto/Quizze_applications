from django.urls import path
from .views import topic_list_create, topic_detail

urlpatterns = [

    path("", topic_list_create, name="topic-list"),

    path("<int:pk>/", topic_detail, name="topic-detail"),

]
