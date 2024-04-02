const user = require('../models/user.js');

const userService = {};

/**
 * Finds a user by id.
 * @param {String} id - The id of the user to find.
 * @returns {Promise<Object|null>} A promise that resolves to the found user object or null if not found.
 */
const findById = async (id) => {
  return user.findOne({ where: { id }, raw: true });
};

/**
 * Finds a user by email.
 * @param {String} email - The email of the user to find.
 * @returns {Promise<Object|null>} A promise that resolves to the found user object or null if not found.
 */
const findByEmail = async (email) => {
  return user.findOne({ where: { email }, raw: true });
};

/**
 * Updates a user by ID.
 * @param {String} id - The ID of the user to update.
 * @param {Object} data - The data to update for the user.
 * @returns {Promise<Object|null>} A promise that resolves to the updated user object or null if not found.
 */
const updateById = async (id, data) => {
  const updateUser = await user.update(data, {
    where: { id },
    returning: true,
    raw: true,
  });
  return updateUser[1][0];
};

userService.findById = findById;
userService.findByEmail = findByEmail;
userService.updateById = updateById;

module.exports = userService;
