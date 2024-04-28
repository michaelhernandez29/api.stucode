const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const config = require('../config');

const cryptoHelper = {};

/**
 * Generates a hash for the provided text using bcrypt.
 * @param {String} text - The text to hash.
 * @returns {Promise<String>} A promise that resolves with the hashed text.
 */
const hash = async (text) => {
  const saltRounds = config.get('cryto.saltRounds');
  return bcrypt.hash(text, saltRounds);
};

/**
 * Compares a plain text password with a hashed password.
 * @param {String} text - The plaintext password.
 * @param {String} hash - The hashed password to compare against.
 * @returns {Promise<Boolean>} A promise that resolves with true if the passwords match, otherwise false.
 */
const comparePasswords = async (plainText, hash) => {
  return bcrypt.compare(plainText, hash);
};

/**
 * Signs the provided data into a JWT token.
 * @param {Object} data - The data to include in the token.
 * @returns {Promise<String>} A promise that resolves with the signed JWT token.
 */
const sign = async (data) => {
  const privateKey = config.get('cryto.privateKey');
  const expiresIn = config.get('cryto.expiresIn');
  return jwt.sign(data, privateKey, { expiresIn });
};

/**
 * Verifies the authenticity of a JWT token and decodes its payload.
 * @param {String} token - The JWT token to verify.
 * @returns {Object} The decoded payload if the token is valid, otherwise throws an error.
 */
const verify = async (token) => {
  const privateKey = config.get('cryto.privateKey');
  return jwt.verify(token, privateKey);
};

cryptoHelper.hash = hash;
cryptoHelper.comparePasswords = comparePasswords;
cryptoHelper.sign = sign;
cryptoHelper.verify = verify;

module.exports = cryptoHelper;
