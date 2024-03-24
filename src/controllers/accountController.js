const errorMessages = require('../constants/errorMessages.js');
const responseHelper = require('../helpers/responseHelper.js');
const accountService = require('../services/accountService.js');

const accountController = {};

/**
 * Handler for GET /account/{id}
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const findById = async (req, res) => {
  const id = req.params.id;

  const account = await accountService.findById(id);
  if (!account) {
    responseHelper.notFound(res, errorMessages.ACCOUNT_NOT_FOUND);
    return;
  }

  responseHelper.ok(res, account);
};

accountController.findById = findById;

module.exports = accountController;
