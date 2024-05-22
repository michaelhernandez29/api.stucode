const responseHelper = require('../helpers/responseHelper');
const likeService = require('../services/likeService');

const likeController = {};

/**
 * Handler for POST /like/{id}
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const create = async (req, res) => {
  const articleId = req.params.id;
  const payload = req.body;

  const response = await likeService.create({ articleId, ...payload });

  responseHelper.created(res, response);
};

likeController.create = create;

module.exports = likeController;
