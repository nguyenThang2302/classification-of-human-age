const {ok} = require('../helpers/response.helper');
const { MediaService, UserService } = require('../services/index');

const Controller = module.exports;

Controller.getSearchImagesHistory = async (req, res, next) => {
  try {
    await MediaService.getSearchImagesHistory(req, res, next);
  } catch (error) {
    return next(error);
  }
};

Controller.getListMail = async (req, res, next) => {
  try {
    await UserService.getListMail(req, res, next);
  } catch (error) {
    return next(error);
  }
};

Controller.adminGetImageDetails = async (req, res, next) => {
  try {
    await MediaService.adminGetImageDetails(req, res, next);
  } catch (error) {
    return next(error);
  }
};

Controller.adminEditImageDetails = async (req, res, next) => {
  try {
    await MediaService.adminEditImageDetails(req, res, next);
  } catch (error) {
    return next(error);
  }
};

Controller.getAgeFolders = async (req, res, next) => {
  try {
    await MediaService.getAgeFolders(req, res, next);
  } catch (error) {
    return next(error);
  }
};

Controller.getAgeImages = async (req, res, next) => {
  try {
    await MediaService.getAgeImages(req, res, next);
  } catch (error) {
    return next(error);
  }
};

Controller.getGenderImages = async (req, res, next) => {
  try {
    await MediaService.getGenderImages(req, res, next);
  } catch (error) {
    return next(error);
  }
};

Controller.deleteImageDetails = async (req, res, next) => {
  try {
    await MediaService.deleteImageDetails(req, res, next);
  } catch (error) {
    return next(error);
  }
};

Controller.getTrashImageDetails = async (req, res, next) => {
  try {
    await MediaService.getTrashImageDetails(req, res, next);
  } catch (error) {
    return next(error);
  }
};

Controller.restoreImageDetails = async (req, res, next) => {
  try {
    await MediaService.restoreImageDetails(req, res, next);
  } catch (error) {
    return next(error);
  }
};
