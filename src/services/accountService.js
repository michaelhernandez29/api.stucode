const account = require('../models/account.js');

const accountService = {};

/**
 * Finds an account by id.
 * @param {String} id - The id of the account to find.
 * @returns {Promise<Object|null>} A promise that resolves to the found account object or null if not found.
 */
const findById = async (id) => {
  return account.findOne({ where: { id }, raw: true });
};

/**
 * Deletes an account by id.
 * @param {String} id - The id of the account to delete.
 */
const deleteById = async (id) => {
  await account.destroy({ where: { id } });
};

accountService.findById = findById;
accountService.deleteById = deleteById;

module.exports = accountService;
