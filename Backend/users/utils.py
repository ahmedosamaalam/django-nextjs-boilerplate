import logging
import re
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User

logger = logging.getLogger(__name__)

def is_valid_username(value):
    # Add username validation logic here
    pattern = r"^(?!.*\.\.)(?!.*\.$)(?!^\.)[a-zA-Z0-9_.]{1,30}$"
    return re.match(pattern, value)


def is_valid_password(value):
    # Add password validation logic here
    return re.match(r"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$", value)


def is_valid_email(value):
    # Add email validation logic here
    return re.match(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", value)


def get_django_user(decoded_token):

    # Extract information from the decoded Firebase token
    email = decoded_token.get("email")
    try:
        # Try to get the user by firebase_uid
        django_user = User.objects.get(email=email)
    except ObjectDoesNotExist:
        logger.info("User doesn't exist for provided token.")
        django_user = None

    return django_user
