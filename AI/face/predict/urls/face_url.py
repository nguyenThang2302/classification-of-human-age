from django.urls import path
from predict.views.face_view import FaceListView

urlpatterns = [
    path("", FaceListView.as_view(), name="list"),
]
