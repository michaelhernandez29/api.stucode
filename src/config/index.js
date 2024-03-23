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
  cryto: {
    saltRounds: {
      doc: 'The number of salt rounds for cryptography',
      format: 'int',
      default: 10,
      env: 'CRYPTO_SALTROUNDS',
    },
    privateKey: {
      doc: 'The private key for cryptography',
      format: '*',
      env: 'CRYPTO_PRIVATEKEY',
    },
    expiresIn: {
      doc: 'The expiration time for cryptographic',
      format: '*',
      env: 'CRYPTO_EXPIRESIN',
    },
  },
});

config.validate({ allowed: 'strict' });

export default config;
