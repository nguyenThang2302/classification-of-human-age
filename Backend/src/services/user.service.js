const _ = require('lodash');
const { AppDataSource } = require('../database/ormconfig');
const User = require('../database/entities/user.entity');
const bcrypt = require('bcrypt');
const { BadRequestError } = require('../errors');
const { ok } = require('../helpers/response.helper');

const UserService = module.exports;
const userRepository = AppDataSource.getRepository(User);

UserService.isExistingEmail = async (email) => {
  const user =  await userRepository.findOneBy({ email });
  return _.isNull(user);
};

UserService.insertUser = async (user) => {
  const userData = userRepository.create(user);
  await userRepository.save(userData);
  return userData;
};

UserService.validateUser = async (user) => {
  const userData = await userRepository.findOneBy({ email: user.email });

  if (!_.isNull(userData) && (await bcrypt.compare(user.password, userData.password))) {
    return userData;
  }

  throw new BadRequestError(t('LO-001'));
};

UserService.getUserInfo = async (userID) => {
  return await userRepository.findOneBy({ id: userID });
};

UserService.getUserByEmail = async (email) => {
  return await userRepository.findOneBy({ email: email });
};

UserService.updatePassword = async (userID, password) => {
  await userRepository.update(userID, { password: password });
};

UserService.update2FA = async (userID, secret, is2FAEnable) => {
  await userRepository.update(userID, { secret: secret, is_2fa_enabled: is2FAEnable });
};

UserService.getListMail = async (req, res, next) => {
  try {
    const users = await userRepository.createQueryBuilder('users')
      .select(['users.email'])
      .orderBy('users.created_at', 'DESC')
      .getMany();

    return ok(req, res, { items: users });
  } catch (error) {
    return next(error);
  }
}
