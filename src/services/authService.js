const db = require('../lib/db.js');
const user = require('../models/user.js');
const account = require('../models/account.js');

const authService = {};

/**
 * Creates a new user along with an associated account.
 * @param {Object} data - The data for creating the user.
 * @returns {Promise<Object>} A promise that resolves to the created user data.
 */
const createUserWithAssociatedAccount = async (data) => {
  const transaction = await db.transaction();

  const newAccount = await account.create({}, { transaction });
  const newAccountData = await newAccount.get({ plain: true });

  const newUserPayload = { ...data, accountId: newAccountData.id };
  const newUser = await user.create(newUserPayload, { transaction });

  await transaction.commit();
  return newUser.get({ plain: true });
};

authService.createUserWithAssociatedAccount = createUserWithAssociatedAccount;

module.exports = authService;
