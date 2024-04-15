const _ = require('lodash');
const { ReasonPhrases, StatusCodes } = require('http-status-codes');

const errorCodes = require('../constants/errorCodes.js');

const responseHelper = {};

/**
 * Sends a successful response (HTTP status code 200 OK).
 * @param {Response} res - The response object.
 * @param {Object?} [data=null] - The data to send in the response body.
 * @param {Number?} [count=null] - The count of data items
 */
const ok = (res, data = null, count = null) => {
  const response = {
    statusCode: StatusCodes.OK,
    message: ReasonPhrases.OK,
  };

  if (!_.isNil(count)) {
    response.count = count;
  }

  if (!_.isNil(data)) {
    response.data = data;
  }

  res.status(response.statusCode).json(response);
};

/**
 * Sends a response indicating a resource was created (HTTP status code 201 Created).
 * @param {Response} res - The response object.
 * @param {Object?} [data=null] - The data to send in the response body.
 */
const created = (res, data) => {
  const response = {
    statusCode: StatusCodes.CREATED,
    message: ReasonPhrases.CREATED,
    data,
  };

  res.status(response.statusCode).json(response);
};

/**
 * Sends a response indicating a bad request (HTTP status code 400 Bad Request).
 * @param {Response} res - The response object.
 * @param {String} [message='Bad Request'] - The error message.
 * @param {String} [errorCode='400'] - The error code.
 */
const badRequest = (res, message = ReasonPhrases.BAD_REQUEST, errorCode = errorCodes.BAD_REQUEST) => {
  const response = {
    statusCode: StatusCodes.BAD_REQUEST,
    message,
    errorCode,
  };

  res.status(response.statusCode).json(response);
};

/**
 * Sends a response indicating unauthorized access (HTTP status code 401 Unauthorized).
 * @param {Response} res - The response object.
 * @param {String} [message='Unauthorized'] - The error message.
 * @param {String} [errorCode='401'] - The error code.
 */
const unAuthorized = (res, message = ReasonPhrases.UNAUTHORIZED, errorCode = errorCodes.UNAUTHORIZED) => {
  const response = {
    statusCode: StatusCodes.UNAUTHORIZED,
    message,
    errorCode,
  };

  res.status(response.statusCode).json(response);
};

/**
 * Sends a response indicating forbidden access (HTTP status code 403 Forbidden).
 * @param {Response} res - The response object.
 * @param {String} [message='Forbidden'] - The error message.
 * @param {String} [errorCode='403'] - The error code.
 */
const forbidden = (res, message = ReasonPhrases.FORBIDDEN, errorCode = errorCodes.FORBIDDEN) => {
  const response = {
    statusCode: StatusCodes.FORBIDDEN,
    message,
    errorCode,
  };

  res.status(response.statusCode).json(response);
};

/**
 * Sends a response indicating resource not found (HTTP status code 404 Not Found).
 * @param {Response} res - The response object.
 * @param {String} [message='Not Found'] - The error message.
 * @param {String} [errorCode='404'] - The error code.
 */
const notFound = (res, message = ReasonPhrases.NOT_FOUND, errorCode = errorCodes.NOT_FOUND) => {
  const response = {
    statusCode: StatusCodes.NOT_FOUND,
    message,
    errorCode,
  };

  res.status(response.statusCode).json(response);
};

/**
 * Sends a response indicating a conflict (HTTP status code 409 Conflict).
 * @param {Response} res - The response object.
 * @param {String} [message='Conflict'] - The error message.
 * @param {String} [errorCode='409'] - The error code.
 */
const conflict = (res, message = ReasonPhrases.CONFLICT, errorCode = errorCodes.CONFLICT) => {
  const response = {
    statusCode: StatusCodes.CONFLICT,
    message,
    errorCode,
  };

  res.status(response.statusCode).json(response);
};

/**
 * Sends a response indicating an internal server error (HTTP status code 500 Internal Server Error).
 * @param {Response} res - The response object.
 * @param {String} [message='Internal Server Error'] - The error message.
 * @param {String} [errorCode='500'] - The error code.
 */
const error = (res, message = ReasonPhrases.INTERNAL_SERVER_ERROR, errorCode = errorCodes.INTERNAL_SERVER_ERROR) => {
  const response = {
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message,
    errorCode,
  };

  res.status(response.statusCode).json(response);
};

/**
 * Sends a custom error response.
 * @param {Response} res - The response object.
 * @param {number} status - The HTTP status code.
 * @param {String} message - The error message.
 * @param {String} errorCode - The error code.
 */
const custom = (res, status, message, errorCode) => {
  const response = {
    statusCode: status,
    message,
    errorCode,
  };

  res.status(response.statusCode).json(response);
};

responseHelper.ok = ok;
responseHelper.created = created;
responseHelper.forbidden = forbidden;
responseHelper.badRequest = badRequest;
responseHelper.unAuthorized = unAuthorized;
responseHelper.notFound = notFound;
responseHelper.conflict = conflict;
responseHelper.error = error;
responseHelper.custom = custom;

module.exports = responseHelper;
