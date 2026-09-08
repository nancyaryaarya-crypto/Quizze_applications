from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import register, profile

urlpatterns = [
    # Register
    path("register/", register, name="register"),

    # Login (JWT)
    path("login/", TokenObtainPairView.as_view(), name="login"),

    # Refresh Token
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Logged-in User Profile
    path("profile/", profile, name="profile"),
]
