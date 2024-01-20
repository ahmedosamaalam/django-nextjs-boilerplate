from django.db import models
from common.models.CommonModel import BaseModel
from django.contrib.auth.models import User


class AuthProvider(models.Choices):
    FIREBASE = "firebase"
    DISCORD = "discord"
    EMAIL = "email"
    ANONYMOUS = "anonymous"


class UserProfile(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    firebase_uid = models.CharField(max_length=128)
    name = models.CharField(max_length=510)
    email = models.EmailField()
    username = models.CharField(max_length=255)
    email_verified = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    photo_url = models.URLField(null=True, blank=True)
    provider = models.CharField(
        max_length=255, choices=AuthProvider.choices, default=AuthProvider.FIREBASE
    )
    address = models.TextField(null=True, blank=True)
    state = models.CharField(max_length=255, null=True, blank=True)
    country = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.name
