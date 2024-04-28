const _ = require('lodash');
const { StatusCodes } = require('http-status-codes');

const config = require('../config');
const errorMessages = require('../constants/errorMessages');
const cryptoHelper = require('../helpers/cryptoHelper');

/**
 * Middleware for handling authentication.
 * @param {Request} req - The Express request object.
 * @returns {Promise<Boolean>} A Promise that resolves to true if authentication is successful, else throws an error.
 */
module.exports = async (req) => {
  const authorization = req.headers.authorization ?? null;
  const authType = authorization ? authorization.split(' ')[0] : undefined;
  const authValue = authorization ? authorization.split(' ')[1] : undefined;

  const error = new Error(errorMessages.UNAUTHORIZED);
  error.statusCode = StatusCodes.UNAUTHORIZED;
  if (_.isNil(authType) || _.isNil(authValue)) {
    throw error;
  }

  const payload = await cryptoHelper.verify(authValue, config.get('cryto.privateKey'));
  if (!payload) {
    throw error;
  }
  req._user = payload;
  return true;
};
