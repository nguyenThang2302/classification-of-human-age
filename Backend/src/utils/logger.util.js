const _ = require('lodash');
const winston = require('winston');

const requestInfo = {};

const LoggerUtil = module.exports;

LoggerUtil.setRequestId = (requestId) => {
  _.set(requestInfo, 'request_id', requestId);
};

LoggerUtil.cleanRequestId = () => {
  delete requestInfo.request_id;
};

LoggerUtil.apiFormat = winston.format.printf((info) => {
  const data = [
    info.timestamp,
    `[${info.level}]`,
    _.get(requestInfo, 'request_id', null),
    info.message
  ];

  if (!_.isEmpty(info.metadata)) {
    data.push(JSON.stringify(info.metadata));
  }

  return _.join(data, ' ');
});

LoggerUtil.logger = winston;
