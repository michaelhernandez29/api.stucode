const convict = require('convict');
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config({ path: '.env.local' });
}

const config = convict({
  env: {
    doc: 'The application environment',
    format: ['production', 'test', 'local'],
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
      default: 'syVCqt8Hg4H6iYe2',
      env: 'CRYPTO_PRIVATEKEY',
    },
    expiresIn: {
      doc: 'The expiration time for cryptographic',
      format: '*',
      default: '7d',
      env: 'CRYPTO_EXPIRESIN',
    },
  },
  sequelize: {
    database: {
      doc: 'The name of the database',
      format: '*',
      default: 'stucode',
      env: 'POSTGRES_DB',
    },
    username: {
      doc: 'The username of the database',
      format: '*',
      default: 'stucode',
      env: 'POSTGRES_USER',
    },
    password: {
      doc: 'The password of the database',
      format: '*',
      default: 'stucode',
      env: 'POSTGRES_PASSWORD',
    },
    host: {
      doc: 'The host of the database',
      format: '*',
      default: 'localhost',
      env: 'POSTGRES_HOST',
    },
  },
});

config.validate({ allowed: 'strict' });

module.exports = config;
