const {ok} = require('../helpers/response.helper');
const { MediaService } = require('../services/index');

const Controller = module.exports;

Controller.getSearchImagesHistory = async (req, res, next) => {
  try {
    await MediaService.getSearchImagesHistory(req, res, next);
  } catch (error) {
    return next(error);
  }
};
