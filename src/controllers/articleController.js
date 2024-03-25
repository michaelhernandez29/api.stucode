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

articleController.create = create;

module.exports = articleController;
