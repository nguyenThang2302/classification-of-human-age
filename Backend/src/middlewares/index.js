const middleware = module.exports;
const authorizer = require('./authorizer');
const adminAuthorizer = require('./admin-authorizer');

middleware.testProcess = (req, res, next) => {
  res.locals.isAPI = true;
  next();
};

middleware.authorizer = authorizer.authorizer;
middleware.adminAuthorizer = adminAuthorizer.authorizer;
