from rest_framework import viewsets, filters, pagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework import status
from common.utils.s3_manager import S3Manager


class StandardResultsSetPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class BaseViewSet(viewsets.ModelViewSet):
    """
    A common viewset that includes CRUD operations, pagination,
    and support for filtering, searching, and ordering.
    """

    pagination_class = StandardResultsSetPagination
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    # Define filter, search, and ordering fields
    filterset_fields = []
    search_fields = [
        "id",
    ]
    ordering_fields = [
        "created_at",
    ]
    
    action_serializers = {}
    
    def get_serializer_class(self):
        if hasattr(self, "action_serializers") and self.action in self.action_serializers:
            return self.action_serializers[self.action]
        return super().get_serializer_class()

    def get_queryset(self):
        """
        Optionally restricts the returned queryset,
        by filtering against query parameters in the URL.
        """
        queryset = self.queryset
        for key, value in self.request.query_params.items():
            if hasattr(self.queryset.model, key):
                queryset = queryset.filter(**{key: value})
        return queryset


class S3FileMixin:
    s3_manager = S3Manager()

    def upload_file(
        self,
        key,
        data,
    ):
        presigned_url = self.s3_manager.upload_file_presigned_url(
            key, data,
        )
        if presigned_url:
            return Response({"presigned_url": presigned_url}, status=status.HTTP_200_OK)
        return Response(
            {"message": "File uploaded successfully"}, status=status.HTTP_201_CREATED
        )

    def download_file(self, key):
        presigned_url = self.s3_manager.get_file_presigned_url(key)
        if presigned_url:
            return Response({"presigned_url": presigned_url}, status=status.HTTP_200_OK)
        return Response(
            {"message": "Failed to generate presigned URL"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def delete_file(self, key):
        self.s3_manager.delete_file(key)
        return Response(
            {"message": "File deleted successfully"}, status=status.HTTP_200_OK
        )
