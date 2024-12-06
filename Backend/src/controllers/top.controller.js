const { ok } = require('../helpers/response.helper');
const {
  name,
  version
} = require('../../package.json');

const Controller = module.exports;

Controller.status = async (req, res) => ok(req, res, {
  name,
  version
});
