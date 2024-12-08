import io
import os

import numpy
from PIL import Image
import cloudinary
import cloudinary.uploader


from django.conf import settings


cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
    secure=True,
)

FOLDER_FACE_AGE = "face-age"
FOLDER_ORIGIN = "origin"
FOLDER_PREDICTED = "predicted"
FOLDER_LABELED = "labeled/unknown"


def upload_image(file_object, folder):
    """Upload the image to the cloudinary."""
    image_to_upload = file_object

    if isinstance(file_object, numpy.ndarray):
        image_to_upload = Image.fromarray(file_object)

    if isinstance(file_object, (Image.Image, numpy.ndarray)):
        buffer = io.BytesIO()
        image_to_upload.save(buffer, format="jpeg")
        buffer.seek(0)
        image_to_upload = buffer

    response = cloudinary.uploader.upload(
        file=image_to_upload,
        asset_folder=os.path.join(FOLDER_FACE_AGE, folder),
    )

    return {
        "secure_url": response["secure_url"],
        "public_id": response["public_id"],
    }
