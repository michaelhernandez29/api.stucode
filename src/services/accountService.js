const account = require('../models/account.js');

const accountService = {};

/**
 * Finds an account by id.
 * @param {String} id - The id of the account to find.
 * @returns {Promise<Object|null>} A promise that resolves to the found account object or null if not found.
 */
const findById = (id) => {
  return account.findOne({ where: { id }, raw: true });
};

accountService.findById = findById;

module.exports = accountService;
