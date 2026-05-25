const AppError = require('../utils/AppError');
const logger = require('../utils/logger');
const { HTTP_STATUS } = require('../constants');

function errorHandler(err, req, res, _next) {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal server error';

  if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    message = 'Duplicate field value';
  }

  if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid resource ID';
  }

  if (!(err instanceof AppError) && statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    logger.error('Unhandled error', {
      error: err.message,
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
    });
    if (process.env.NODE_ENV === 'production') {
      message = 'Something went wrong';
    }
  } else {
    logger.warn('Operational error', {
      error: message,
      statusCode,
      path: req.originalUrl,
    });
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || undefined,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

module.exports = errorHandler;
