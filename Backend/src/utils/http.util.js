const _ = require('lodash');
const axios = require('axios');
const winston = require('winston');

const defaultRequest = {
  headers: {}
};

axios.interceptors.request.use((request) => {
  request.headers.common = _.assign(defaultRequest.headers || {}, request.headers.common);
  winston.debug({
    message: 'Request',
    isNotMessageLog: true,
    request,
    service: 'HttpUtil',
    action: 'request',
    extraData: _.pick(
      request,
      ['headers', 'baseURL', 'method', 'url', 'data']
    )
  });

  return request;
});

axios.interceptors.response.use((response) => {
  winston.debug({
    message: 'Response',
    isNotMessageLog: true,
    service: 'HttpUtil',
    action: 'response',
    extraData: _.assign(
      {},
      _.pick(response, ['status', 'data']),
      _.pick(response.data, ['data']),
      _.pick(response.config, ['baseURL', 'method', 'url'])
    ),
    error: _.pick(response.data, ['error', 'errors'])
  });

  return response;
});

const HttpUtil = module.exports;

HttpUtil.request = (urlOptions, data) => axios.request({ ...urlOptions, ...{ data } });

HttpUtil.setHeaders = (headers, gwId) => {
  defaultRequest.headers['User-Agent'] = `AwsApiGateway/${gwId} ${_.get(headers, 'User-Agent', '')}`;
};
