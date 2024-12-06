const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { UnauthorizedError, ForbiddenError } = require('../errors');
const { JWT_SECRET_KEY } = process.env;

const Authorizer = module.exports;

Authorizer.authorizer = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return next(new UnauthorizedError("User can't access"));
    }
    const user = await jwt.verify(token, JWT_SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    return next(new UnauthorizedError("User can't access"));
  }
};
