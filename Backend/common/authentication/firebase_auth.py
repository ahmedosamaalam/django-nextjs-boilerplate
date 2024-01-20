import logging
from django.http import JsonResponse
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from firebase_admin import auth as firebase_auth
from users.utils import get_django_user

logger = logging.getLogger(__name__)


class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        jwt_token = request.META.get("HTTP_AUTHORIZATION")
        if jwt_token is None:
            logger.info("No JWT token found")
            return None

        if jwt_token.startswith("Bearer "):
            jwt_token = jwt_token[7:]

        try:
            decoded_token = firebase_auth.verify_id_token(jwt_token)
            user = get_django_user(decoded_token)
            if user:
                return (user, None)  # Authentication successful
            raise AuthenticationFailed("No corresponding user in DJ")
        except firebase_auth.InvalidIdTokenError:
            logger.info("Invalid FB token")
            raise AuthenticationFailed("Invalid FB token", code="authentication_failed")
        except Exception as e:
            logger.exception(e)
            return AuthenticationFailed({"error": str(e)})

        return None
