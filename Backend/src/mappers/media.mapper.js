const MediaMapper = module.exports;

MediaMapper.toUploadImageResponse = (predicted_image, seperated_images) => ({ data: { predicted_image, seperated_images } });
MediaMapper.toImagesHistoryResponse = (data) => ({ items: data });
MediaMapper.toImageDetailResponse = (data) => ({ data: data });
