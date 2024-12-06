const { MediaService } = require('../services/index');
const { addImageToQueue } = require('../config/cloudinary.config');
const { MediaMapper } = require('../mappers/index');
const {ok} = require('../helpers/response.helper');

const Controller = module.exports;

Controller.uploadImages = async (req, res, next) => {
  try {
    addImageToQueue(req, res, next);

    return ok(req, res, MediaMapper.toUploadImageResponse(req['prediction'].predicted_class, req['prediction'].confidence, req['description']));
  } catch (error) {
    return next(error);
  }
};

Controller.imagesHistory = async (req, res, next) => {
  try {
    await MediaService.getImagesHistory(req, res, next);
  } catch (error) {
    return next (error);
  }
}

Controller.getImageDetail = async (req, res, next) => {
  try {
    await MediaService.getImageDetail(req, res, next);
  } catch (error) {
    return next(error);
  }
}
