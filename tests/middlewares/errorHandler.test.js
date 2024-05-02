const { mockRequest, mockResponse } = require('jest-mock-req-res');

const config = require('../../api/config');
const server = require('../../api/server');
const errorHandler = require('../../api/middlewares/errorHandler');
const logger = require('../../api/helpers/logger');
const responseHelper = require('../../api/helpers/responseHelper');

let app;

jest.mock('../../api/helpers/logger', () => ({
  error: jest.fn(),
}));

jest.mock('../../api/helpers/responseHelper', () => ({
  error: jest.fn(),
}));

describe('Error Handling Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    app = server.listen(config.get('port'));

    req = mockRequest();
    res = mockResponse();
    next = jest.fn();
  });

  it('should log and respond with generic error for unknown error', () => {
    const err = new Error('Unexpected error');

    errorHandler(err, req, res, next);

    expect(logger.error).toHaveBeenCalledWith({
      message: '[Unexpected error]: Unexpected error',
      error: err,
      operationId: undefined,
    });

    expect(responseHelper.error).toHaveBeenCalledWith(res);
  });

  it('should log and respond with generic error for unknown error with operationId', () => {
    const err = new Error('Unexpected error');
    req.openapi = { schema: { operationId: 'someOperation' } };

    errorHandler(err, req, res, next);

    expect(logger.error).toHaveBeenCalledWith({
      message: '[Unexpected error] [someOperation]: Unexpected error',
      error: err,
      operationId: 'someOperation',
    });

    expect(responseHelper.error).toHaveBeenCalledWith(res);
  });

  afterEach(async () => {
    app.close();
    jest.clearAllMocks();
  });
});
