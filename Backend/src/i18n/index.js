const { readFileSync } = require('fs');
const { join } = require('path');
const _ = require('lodash');

const { LOCALE } = process.env;
const messages = JSON.parse(readFileSync(join(__dirname, `./${LOCALE}.json`))) || {};

global.t = (code) => _.get(messages, code, code);
global.getLocaleMessages = () => messages;
