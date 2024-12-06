const middleware = module.exports;
const authorizer = require('./authorizer');

middleware.testProcess = (req, res, next) => {
  res.locals.isAPI = true;
  next();
};

middleware.authorizer = authorizer.authorizer;
