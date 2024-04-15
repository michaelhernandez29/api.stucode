const logger = require('../helpers/logger');
const responseHelper = require('../helpers/responseHelper');

/**
 * Express middleware for handling errors.
 * @param {Error} err - The error object.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 */
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const operationId = req?.openapi?.schema?.operationId;

  if (err.status) {
    const errorName = operationId ? `[error] [${operationId}]` : '[error]';
    logger.error({
      message: `${errorName}: ${err.message}`,
      error: err,
      operationId,
    });

    responseHelper.custom(res, err.status, err.message);
    return;
  }

  const errorName = operationId ? `[Unexpected error] [${operationId}]` : '[Unexpected error]';

  logger.error({
    message: `${errorName}: ${err.message}`,
    error: err,
    operationId,
  });

  responseHelper.error(res);
};
