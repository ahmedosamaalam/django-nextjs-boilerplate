from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import (
    RegisterUserView,
    S3FileView,
    UsernameAvailabilityAPIView,
    UserProfileViewSet,
    EmailAvailabilityAPIView,
)

router = DefaultRouter()
router.register(r"profile", UserProfileViewSet, basename="profile")


urlpatterns = [
    path("register/", RegisterUserView.as_view(), name="register"),
    path(
        "check-username/", UsernameAvailabilityAPIView.as_view(), name="check-username"
    ),
    path("check-email/", EmailAvailabilityAPIView.as_view(), name="check-email"),
    path(
        "files/create_presigned_url/<str:key>/",
        S3FileView.as_view(),
        name="create-presigned-url",
    ),
    path("files/download/<str:key>/", S3FileView.as_view(), name="file-download"),
    path("files/delete/<str:key>/", S3FileView.as_view(), name="file-delete"),
    path("", include(router.urls)),
]
