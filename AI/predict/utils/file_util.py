"""File utility functions."""

import base64
from io import BytesIO

from django.core.files.uploadedfile import InMemoryUploadedFile
from numpy import ndarray
from PIL import Image


def convert_image_to_base64(image):
    """Convert image to base64."""
    if isinstance(image, InMemoryUploadedFile):
        data = image.read()
        image_format = image.content_type.split("/")[-1]
        image.seek(0)
    elif isinstance(image, (Image.Image, ndarray)):
        if isinstance(image, ndarray):
            image = Image.fromarray(image)
        buffer = BytesIO()
        image.save(buffer, format="jpeg")
        data = buffer.getvalue()
        image_format = "jpeg"
    else:
        raise ValueError(f"Unsupported object type: {type(image)}")

    base64_str = base64.b64encode(data).decode("utf-8")
    return f"data:image/{image_format};base64,{base64_str}"
