from rest_framework import generics, status
from rest_framework.response import Response

from predict.serializers.upload_face_image_serializer import UploadFaceImageSerializer


class FaceListView(generics.GenericAPIView):
    """Index view."""

    permission_classes = []
    authentication_classes = []
    serializer_class = UploadFaceImageSerializer

    def post(self, request):
        """Post method."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.save(), status=status.HTTP_200_OK)

    def get(self, request):
        """Get method."""
        return Response(123)
