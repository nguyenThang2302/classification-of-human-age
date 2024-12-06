const Queue = require('bull');
const redis = require('../config/redis.config');

const imageUploadQueue = new Queue('imageUploadQueue', {
  redis: redis.redisConfig,
});

module.exports = {
  imageUploadQueue
};
