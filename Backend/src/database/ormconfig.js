const { DataSource } = require('typeorm');
const config = require('../config/config');

const ORMConfig = module.exports;

ORMConfig.AppDataSource = new DataSource({
  ...config[process.env.NODE_ENV],
  entities: [__dirname + '/entities/*.entity.js'],
  migrations: [
    __dirname + '/migrations/*.js'
  ],
  synchronize: false,
  logging: false,
});
