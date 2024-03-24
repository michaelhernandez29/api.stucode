const user = require('../models/user.js');

const userService = {};

/**
 * Finds a user by email.
 * @param {String} email - The email of the user to find.
 * @returns {Promise<Object|null>} A promise that resolves to the found user object or null if not found.
 */
const findByEmail = async (email) => {
  return user.findOne({ where: { email }, raw: true });
};

userService.findByEmail = findByEmail;

module.exports = userService;
