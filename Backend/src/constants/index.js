const Constants = module.exports;

Constants.VALIDATE_ON = Object.freeze({
  BODY: 'body',
  QUERY: 'query',
  PARAMS: 'params'
});

Constants.PAGINATION = Object.freeze({
  DEFAULT_LIMIT: 20,
  DEFAULT_OFFSET: 0
});

Constants.JWT = Object.freeze({
  DEFAULT_JWT_EXPIRES_IN_SECOND: 6.312e+7
});

Constants.ACCESS_FROM_MOBILE = 'mobile';
Constants.QUERY_ACCESS_NAME = 'access-from';

Constants.ROLES = Object.freeze({
  ADMIN: 1,
  USER: 2
});
