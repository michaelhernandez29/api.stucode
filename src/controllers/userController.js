const _ = require('lodash');
const isEmail = require('isemail');

const errorMessages = require('../constants/errorMessages');
const cryptoHelper = require('../helpers/cryptoHelper.js');
const responseHelper = require('../helpers/responseHelper');
const userService = require('../services/userService');

const userController = {};

/**
 * Handler for POST /user/register
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
  let response = await userService.createUser(payload);
  response = _.omit(response, 'password');

  responseHelper.created(res, response);
};

/**
 * Handler for POST /user/login
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

/**
 * Handler for GET /user
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const findAll = async (req, res) => {
  const filters = req.query;

  let response = await userService.findAllWithCount(filters);
  response.users = response.users.map((user) => _.omit(user, 'password'));

  responseHelper.ok(res, response.users, response.count);
};

/**
 * Handler for GET /user/{id}
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

/**
 * Handler for PUT /user/{id}
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const updateById = async (req, res) => {
  const id = req.params.id;
  const payload = req.body;

  let user = await userService.findById(id);
  if (!user) {
    responseHelper.notFound(res, errorMessages.USER_NOT_FOUND);
    return;
  }

  let response = await userService.updateById(id, payload);
  response = _.omit(response, 'password');

  responseHelper.ok(res, response);
};

userController.register = register;
userController.login = login;
userController.findAll = findAll;
userController.findById = findById;
userController.updateById = updateById;

module.exports = userController;
