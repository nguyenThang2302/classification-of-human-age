const MediaMapper = module.exports;

MediaMapper.toUploadImageResponse = (predicted_image, seperated_images) => ({ data: { predicted_image, seperated_images } });
MediaMapper.toImagesHistoryResponse = (data, paginations) => ({ items: data, paginations });
MediaMapper.toImageDetailResponse = (data) => ({ items: data });
MediaMapper.toEditImageDetailResponse = () => ({ data: {
  message: 'Success'
} });
