import bunyan from 'bunyan';

import config from '../config/index.js';

const logger = bunyan.createLogger({
  name: config.get('bunyan.name'),
  level: 'debug',
  serializers: bunyan.stdSerializers,
});

export default logger;
