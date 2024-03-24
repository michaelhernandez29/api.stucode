const _ = require('lodash');

const errorMessages = require('../constants/errorMessages');
const responseHelper = require('../helpers/responseHelper');
const userService = require('../services/userService');

const userController = {};

/**
 * Handler for GET /account/{id}
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const findById = async (req, res) => {
  const id = req.params.id;

  let user = await userService.findById(id);
  if (!user) {
    responseHelper.notFound(res, errorMessages.USER_NOT_FOUND);
    return;
  }
  user = _.omit(user, 'password');

  responseHelper.ok(res, user);
};

userController.findById = findById;

module.exports = userController;
