"""Upload face image serializer."""

from rest_framework import serializers

from predict.constants.face_constant import MAX_LENGTH_FILE_NAME, MAX_IMAGE_SIZE
from predict.models.face_age_net import face_age_net

from predict.utils.cloudinary_util import (
    FOLDER_LABELED,
    FOLDER_ORIGIN,
    FOLDER_PREDICTED,
    upload_image,
)


class UploadFaceImageSerializer(serializers.Serializer):
    """Upload face image serializer."""

    image = serializers.ImageField(max_length=MAX_LENGTH_FILE_NAME)

    def validate(self, attrs):
        """Validate method."""
        image = attrs["image"]
        if image.size > MAX_IMAGE_SIZE:
            raise serializers.ValidationError(
                "Image size must less than {SIZE} mb.".format(
                    SIZE=MAX_IMAGE_SIZE / 1024 / 1024
                )
            )
        return super().validate(attrs)

    def create(self, validated_data):
        """Create method."""
        origin_image = validated_data.get("image")
        origin_image_response = upload_image(origin_image, FOLDER_ORIGIN)

        predicted_image, seperated_images = face_age_net.predict(origin_image)
        predicted_image_reponse = upload_image(predicted_image, FOLDER_PREDICTED)

        seperated_image_list_response = []
        for seperated_image, gender, age in seperated_images:
            seperated_image_list_response.append(
                {
                    **upload_image(seperated_image, FOLDER_LABELED),
                    "gender": gender,
                    "age": age,
                }
            )

        return {
            "origin_image": origin_image_response,
            "predicted_image": predicted_image_reponse,
            "seperated_images": seperated_image_list_response,
        }
