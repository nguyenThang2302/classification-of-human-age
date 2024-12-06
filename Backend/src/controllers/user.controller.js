const { getUserInfo } = require('../services/user.service');
const { UserMapper } = require('../mappers/index');
const {ok} = require('../helpers/response.helper');

const Controller = module.exports;

Controller.me = async (req, res, next) => {
  try {
    const userID = req.user['id'];
    const user = await getUserInfo(userID);
    return ok(req, res, UserMapper.toUserInfo(user));
  } catch (error) {
    next(error);
  }
};
