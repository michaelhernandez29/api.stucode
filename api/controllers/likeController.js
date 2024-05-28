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

  try {
    const response = await likeService.create({ articleId, ...payload });

    responseHelper.created(res, response);
  } catch (error) {
    responseHelper.conflict(res);
  }
};

/**
 * Handler for GET /like/{articleId}
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const getByArticleId = async (req, res) => {
  const articleId = req.params.articleId;
  const userId = req.query.userId;

  const response = await likeService.findAllByArticleIdWithCount(articleId, userId);

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
  console.log(payload);

  await likeService.deleteByArticleIdAndUserId(articleId, payload.userId);

  responseHelper.ok(res);
};

/**
 * Handler for GET /like/{userId}
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
const getByUserId = async (req, res) => {
  const userId = req.query.userId;

  const response = await likeService.findAllByUserIdWithCount(userId);

  responseHelper.ok(res, response.likes, response.count);
};

likeController.create = create;
likeController.getByArticleId = getByArticleId;
likeController.deleteByArticleIdAndUserId = deleteByArticleIdAndUserId;
likeController.getByUserId = getByUserId;

module.exports = likeController;
