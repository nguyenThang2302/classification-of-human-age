"""File utility functions."""

import base64
from io import BytesIO
from numpy import ndarray

from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image


def convert_image_to_base64(image):
    """Convert image to base64."""
    if isinstance(image, InMemoryUploadedFile):
        data = image.read()
        image.seek(0)
    elif isinstance(image, (Image.Image, ndarray)):
        if isinstance(image, ndarray):
            image = Image.fromarray(image)
        buffer = BytesIO()
        image.save(buffer, format='jpeg')
        data = buffer.getvalue()
    else:
        raise ValueError(f"Unsupported object type: {type(image)}")
    
    return base64.b64encode(data).decode('utf-8')