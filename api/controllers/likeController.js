const responseHelper = require('../helpers/responseHelper');
const likeService = require('../services/likeService');

const likeController = {};

/**
 * Handler for POST /like/{articleId}
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const create = async (req, res) => {
  const articleId = req.params.articleId;
  const payload = req.body;

  const response = await likeService.create({ articleId, ...payload });

  responseHelper.created(res, response);
};

/**
 * Handler for GET /like/{articleId}
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const getByArticleId = async (req, res) => {
  const articleId = req.params.articleId;

  const response = await likeService.findAllWithCount(articleId);

  responseHelper.ok(res, response.likes, response.count);
};

/**
 * Handler for DELETE /like/{articleId}
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const deleteByArticleIdAndUserId = async (req, res) => {
  const articleId = req.params.articleId;
  const payload = req.body;

  await likeService.deleteByArticleIdAndUserId(articleId, payload.userId);

  responseHelper.ok(res);
};

likeController.create = create;
likeController.getByArticleId = getByArticleId;
likeController.deleteByArticleIdAndUserId = deleteByArticleIdAndUserId;

module.exports = likeController;
