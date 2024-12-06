const redisConfig = {
  host: process.env.RD_HOST || 'localhost',
  port: process.env.RD_PORT || 6379,
};

module.exports = {
  redisConfig
};
