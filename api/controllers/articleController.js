const errorMessages = require('../constants/errorMessages.js');
const responseHelper = require('../helpers/responseHelper.js');
const userService = require('../services/userService.js');
const articleService = require('../services/articleService.js');

const articleController = {};

/**
 * Handler for POST /article
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const create = async (req, res) => {
  const payload = req.body;

  const user = await userService.findById(payload.userId);
  if (!user) {
    responseHelper.notFound(res, errorMessages.USER_NOT_FOUND);
    return;
  }

  const response = await articleService.create(payload);

  responseHelper.created(res, response);
};

/**
 * Handler for GET /article
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const findAll = async (req, res) => {
  const filters = req.query;

  const response = await articleService.findAllWithCount(filters);

  responseHelper.ok(res, response.articles, response.count);
};

/**
 * Handler for GET /article/{id}
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const findById = async (req, res) => {
  const id = req.params.id;

  let article = await articleService.findById(id);
  if (!article) {
    responseHelper.notFound(res, errorMessages.ARTICLE_NOT_FOUND);
    return;
  }

  responseHelper.ok(res, article);
};

/**
 * Handler for PUT /user/{id}
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const updateById = async (req, res) => {
  const id = req.params.id;
  const payload = req.body;

  let article = await articleService.findById(id);
  if (!article) {
    responseHelper.notFound(res, errorMessages.ARTICLE_NOT_FOUND);
    return;
  }

  const response = await userService.updateById(id, payload);

  responseHelper.ok(res, response);
};

/**
 * Handler for DELETE /article/{id}
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const deleteById = async (req, res) => {
  const id = req.params.id;

  let article = await articleService.findById(id);
  if (!article) {
    responseHelper.notFound(res, errorMessages.ARTICLE_NOT_FOUND);
    return;
  }

  await articleService.deleteById(id);

  responseHelper.ok(res);
};

articleController.create = create;
articleController.findAll = findAll;
articleController.findById = findById;
articleController.updateById = updateById;
articleController.deleteById = deleteById;

module.exports = articleController;
