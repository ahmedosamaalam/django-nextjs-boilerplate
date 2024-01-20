from django.core.exceptions import ValidationError

from users.utils import is_valid_email, is_valid_username


class UsernameValidator:
    def __init__(self, model):
        self.model = model

    def validate(self, value):
        self.check_format(value)
        self.check_uniqueness(value)

    def check_format(self, value):
        if not is_valid_username(value):
            raise ValidationError(
                "Username must only contain letters (a-z), numbers (0-9), underscores (_), and periods (.)"
            )

    def check_uniqueness(self, value):
        if self.model.objects.filter(username=value).exists():
            raise ValidationError("Username already taken.")


class EmailValidator:
    def __init__(self, model):
        self.model = model

    def validate(self, value):
        self.check_format(value)
        # self.check_email(value)

    def check_format(self, value):
        if not is_valid_username(value):
            raise ValidationError(
                "Username must only contain letters (a-z), numbers (0-9), underscores (_), and periods (.)"
            )

    # def check_email(self, value):
    #     if not self.model.objects.filter(username=value):
    #         raise ValidationError("Email not found.")
