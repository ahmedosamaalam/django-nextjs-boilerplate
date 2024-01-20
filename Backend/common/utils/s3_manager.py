import logging
import boto3
from botocore.exceptions import NoCredentialsError
from django.conf import settings

logger = logging.getLogger(__name__)


class S3Manager:
    def __init__(self):
        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION_NAME,
        )
        self.bucket_name = settings.AWS_STORAGE_BUCKET_NAME

    def upload_file_presigned_url(self, key, data=None, expiration=3600):
        """
        Generate a presigned URL to upload a file to an S3 bucket

        :param key: string, the key under which to store the file
        :param expiration: Time in seconds for the presigned URL to remain valid
        :return: Presigned URL as string. None if error.
        """
        params = {"Bucket": self.bucket_name, "Key": key}
        if data is not None:
            if data.get("content_type"):
                params["ContentType"] = data["content_type"]
            
        try:
            response = self.s3_client.generate_presigned_url(
                "put_object",
                Params=params,
                ExpiresIn=expiration,
                HttpMethod="PUT",
            )
        except NoCredentialsError:
            logger.error("Credentials not available")
            return None

        return response

    def get_file_presigned_url(self, key, expiration=3600):
        """
        Generate a presigned URL to share an S3 object

        :param key: string
        :param expiration: Time in seconds for the presigned URL to remain valid
        :return: Presigned URL as string. None if error.
        """
        try:
            response = self.s3_client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket_name, "Key": key},
                ExpiresIn=expiration,
            )
        except NoCredentialsError:
            logger.error("Credentials not available")
            return None

        return response

    def delete_file(self, key):
        """
        Delete a file from an S3 bucket

        :param key: S3 key of the file to delete
        :return: None
        """
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=key)
        except NoCredentialsError:
            logger.error("Credentials not available")

    def get_object(self, key):
        """
        Get an object from an S3 bucket

        :param key: S3 key of the object to retrieve
        :return: Bytes of the object content. None if object doesn't exist or on error.
        """
        try:
            response = self.s3_client.get_object(Bucket=self.bucket_name, Key=key)
            # Read the content of the object
            object_content = response["Body"].read()
            return object_content
        except NoCredentialsError:
            logger.error("Credentials not available")
            return None
        except self.s3_client.exceptions.NoSuchKey:
            # Handle the case when the specified key doesn't exist
            logger.error(f"Object with key '{key}' does not exist.")
            return None
        except Exception as e:
            logger.error(f"Error retrieving object with key '{key}': {e}")
            return None
