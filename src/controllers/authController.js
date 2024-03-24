const _ = require('lodash');
const isEmail = require('isemail');

const errorMessages = require('../constants/errorMessages.js');
const cryptoHelper = require('../helpers/cryptoHelper.js');
const responseHelper = require('../helpers/responseHelper.js');
const userService = require('../services/userService.js');
const authService = require('../services/authService.js');

const authController = {};

/**
 * Handler for POST /auth/register
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const register = async (req, res) => {
  const payload = req.body;

  if (!isEmail.validate(payload.email)) {
    responseHelper.badRequest(res, errorMessages.EMAIL_FORMAT_NOT_VALID);
    return;
  }

  const user = await userService.findByEmail(payload.email);
  if (user) {
    responseHelper.conflict(res, errorMessages.EMAIL_ALREADY_EXISTS);
    return;
  }

  payload.password = await cryptoHelper.hash(payload.password);
  let response = await authService.createUserWithAssociatedAccount(payload);
  response = _.omit(response, 'password');

  responseHelper.created(res, response);
};

/**
 * Handler for POST /auth/login
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const login = async (req, res) => {
  const payload = req.body;

  if (!isEmail.validate(payload.email)) {
    responseHelper.badRequest(res, errorMessages.EMAIL_FORMAT_NOT_VALID);
    return;
  }

  let user = await userService.findByEmail(payload.email);
  if (!user) {
    responseHelper.notFound(res, errorMessages.USER_NOT_FOUND);
    return;
  }

  const isPasswordCorrect = await cryptoHelper.comparePasswords(payload.password, user.password);
  if (!isPasswordCorrect) {
    responseHelper.badRequest(res, errorMessages.PASSWORD_NOT_VALID);
    return;
  }

  user = _.omit(user, 'password');
  const response = await cryptoHelper.sign(user);

  responseHelper.ok(res, response);
};

authController.register = register;
authController.login = login;

module.exports = authController;
