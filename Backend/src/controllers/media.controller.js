const { MediaService } = require('../services/index');
const { addImageToQueue } = require('../config/cloudinary.config');
const { MediaMapper } = require('../mappers/index');
const {ok} = require('../helpers/response.helper');

const Controller = module.exports;

Controller.uploadImages = async (req, res, next) => {
  try {
    // addImageToQueue(req, res, next);
    const response = req['res_load_model'];
    const originImage = response['origin_image'];
    const predictedImage = response['predicted_image'];
    const seperatedImages = response['seperated_images'];
    return ok(req, res, MediaMapper.toUploadImageResponse(predictedImage, seperatedImages));
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
