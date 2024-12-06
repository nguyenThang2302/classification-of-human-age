const MediaMapper = module.exports;

MediaMapper.toUploadImageResponse = (name, confidence, description) => ({ data: { name: name, confidence: confidence, description: description } });
MediaMapper.toImagesHistoryResponse = (data) => ({ items: data });
MediaMapper.toImageDetailResponse = (data) => ({ data: data });
