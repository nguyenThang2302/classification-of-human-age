"""Upload face image serializer."""

from rest_framework import serializers

from predict.constants.face_constant import MAX_IMAGE_SIZE, MAX_LENGTH_FILE_NAME
from predict.models.face_age_net import face_age_net
from predict.utils.file_util import convert_image_to_base64


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
        origin_image_base64 = convert_image_to_base64(origin_image)

        predicted_image, seperated_images = face_age_net.predict(origin_image)
        predicted_image_base64 = convert_image_to_base64(predicted_image)

        seperated_image_list_response = []
        for seperated_image, gender, age in seperated_images:
            seperated_image_list_response.append(
                {
                    "base64_url": convert_image_to_base64(seperated_image),
                    "gender": gender,
                    "age": age,
                }
            )
        return {
            "origin_image": {
                "base64_url": origin_image_base64,
            },
            "predicted_image": {
                "base64_url": predicted_image_base64,
            },
            "seperated_images": seperated_image_list_response,
        }
