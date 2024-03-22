import convict from 'convict';

const config = convict({
  env: {
    doc: 'The application environment',
    format: ['production', 'local'],
    default: 'local',
    env: 'NODE_ENV',
  },
  port: {
    doc: 'The port to bind',
    format: 'port',
    default: 3609,
    env: 'PORT',
  },
  bunyan: {
    name: {
      doc: 'The name of the bunyan instance',
      format: '*',
      default: 'StuCode',
      env: 'BUNYAN_NAME',
    },
  },
});

config.validate({ allowed: 'strict' });

export default config;
