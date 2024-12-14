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
}
