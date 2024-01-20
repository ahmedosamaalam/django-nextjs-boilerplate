import logging
from django.shortcuts import render
from rest_framework.views import APIView
from common.utils.s3_manager import S3Manager
from common.views.CommonView import BaseViewSet, S3FileMixin
from users.serializers import (
    EmailAvailabilitySerializer,
    FileUploadSerializer,
    LoginSerializer,
    ProfileSerializer,
    RegisterSerializer,
    UsernameAvailabilitySerializer,
)
from rest_framework.response import Response
from rest_framework import status
from users.models import UserProfile
from django.contrib.auth.models import User
from firebase_admin import auth as firebase_auth
from rest_framework.permissions import AllowAny

logger = logging.getLogger(__name__)


class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            validated_data = serializer.validated_data
            name, email, username, password = (
                validated_data["name"],
                validated_data["email"],
                validated_data["username"],
                validated_data["password"],
            )
            try:
                # Create user in Firebase
                firebase_user = firebase_auth.create_user(
                    email=email,
                    email_verified=False,
                    password=password,
                    display_name=name,
                    disabled=False,
                )
                if firebase_user:
                    # Create user in Django
                    django_user = User.objects.create_user(
                        username=username,
                        email=email,
                        password=password,
                    )
                    django_user.save()

                    # Create user profile in Django
                    user_profile = UserProfile.objects.create(
                        user=django_user,
                        firebase_uid=firebase_user.uid,
                        name=name,
                        email=email,
                        username=username,
                    )
                    user_profile.save()

                    return Response(
                        {"message": "User created successfully in both FB and DJ."},
                        status=status.HTTP_201_CREATED,
                    )

                # Create user in Django
                django_user = User.objects.create_user(
                    username=username, email=email, password=password
                )
                django_user.save()

                return Response(
                    {"message": "User created successfully in both FB and DG."},
                    status=status.HTTP_201_CREATED,
                )
            except Exception as e:
                logger.exception(e)
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(
            {"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
        )


class UsernameAvailabilityAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UsernameAvailabilitySerializer(data=request.data)
        if serializer.is_valid():
            return Response({"message": "Username is available."})
        return Response({"error": serializer.errors}, status=status.HTTP_404_NOT_FOUND)


class EmailAvailabilityAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = EmailAvailabilitySerializer(data=request.data)
        if serializer.is_valid():
            return Response({"email": serializer.data["username"]})
        return Response({"error": serializer.errors}, status=status.HTTP_404_NOT_FOUND)


class UserProfileViewSet(BaseViewSet):
    serializer_class = ProfileSerializer
    queryset = UserProfile.objects.all()
    search_fields = ["id", "name", "email", "username", "phone_number"]


class S3FileView(APIView, S3FileMixin):
    def post(self, request, key, *args, **kwargs):
        return self.upload_file(key, request.data)

    def get(self, request, key, *args, **kwargs):
        return self.download_file(self, key)

    def delete(self, request, key, *args, **kwargs):
        return self.delete_file(self, key)
