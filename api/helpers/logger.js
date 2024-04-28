const bunyan = require('bunyan');

const config = require('../config/index.js');

const logger = bunyan.createLogger({
  name: config.get('bunyan.name'),
  level: 'debug',
  serializers: bunyan.stdSerializers,
});

module.exports = logger;
