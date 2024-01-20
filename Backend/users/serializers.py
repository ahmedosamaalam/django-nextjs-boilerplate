from rest_framework import serializers

from users.utils import is_valid_email, is_valid_password, is_valid_username
from users.validators import EmailValidator, UsernameValidator
from .models import UserProfile
from django.contrib.auth.models import User
import re
from django.conf import settings


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "is_active",
            "is_staff",
        ]


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    photo_url = serializers.CharField(
        allow_blank=True, allow_null=True
    )  # This will be the CloudFront URL, at the time of request it simple id  of s3 object

    class Meta:
        model = UserProfile
        fields = [
            "id",
            "firebase_uid",
            "name",
            "username",
            "phone_number",
            "photo_url",
            "is_active",
            "created_at",
            "updated_at",
            "address",
            "state",
            "country",
            "user",
        ]

    def create(self, validated_data):
        # Set the CloudFront URL to the photo_url field
        if validated_data.get("photo_url"):
            cloudfront_url = (
                f"{settings.AWS_CLOUDFRONT_DOMAIN_NAME}/{validated_data['photo_url']}"
            )
            validated_data["photo_url"] = cloudfront_url
        return UserProfile.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Safe side handling, other wise alway user have fb uid and its not editable and alway image replace with new one
        if validated_data.get("photo_url") and not validated_data.get(
            "photo_url"
        ).startswith("http"):
            cloudfront_url = (
                f"{settings.AWS_CLOUDFRONT_DOMAIN_NAME}/{validated_data['photo_url']}"
            )
            validated_data["photo_url"] = cloudfront_url

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(required=True, max_length=255, min_length=4)
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True, max_length=150, min_length=4)
    password = serializers.CharField(
        write_only=True, style={"input_type": "password"}, required=True
    )
    confirm_password = serializers.CharField(
        write_only=True, style={"input_type": "password"}, required=True
    )

    def validate_username(self, value):
        # Add username validation logic here
        if not is_valid_username(value):
            raise serializers.ValidationError(
                "Username must be between 1 and 30 characters and can contain letters, numbers, underscores, and dots (but not consecutively or at the beginning/end)."
            )
        return value

    def is_valid_email(self, value):
        # Add email validation logic here
        if not is_valid_email(value):
            raise serializers.ValidationError("Invalid email format.")
        return value

    def validate_password(self, value):
        # Add password validation logic here
        if not is_valid_password(value):
            raise serializers.ValidationError(
                "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
            )
        return value

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Password fields didn't match."}
            )
        return data


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, max_length=150)
    password = serializers.CharField(
        write_only=True, style={"input_type": "password"}, required=True
    )

    def validate(self, data):
        return data


class UsernameAvailabilitySerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True, max_length=150)

    class Meta:
        model = User
        fields = ["username"]

    def validate_username(self, value):
        validator = UsernameValidator(User)
        validator.validate(value)
        return value


class EmailAvailabilitySerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=True, max_length=150)

    class Meta:
        model = User
        fields = [
            "username",
        ]

    def validate_username(self, value):
        validator = EmailValidator(User)
        validator.validate(value)

        user = User.objects.filter(username=value)
        if not user.exists():
            raise serializers.ValidationError("Username or email not found.")

        return user.first().email


class FileUploadSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self, value):
        """
        Validate that the uploaded file is of an allowed type or meets any other requirements.
        """
        # You can add custom validation logic here if needed
        return value
