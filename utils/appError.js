const { status } = require("http-status");

class AppError extends Error {
  statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  status = "failed";
  isOperational;

  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    logger.error(`statusCode: ${statusCode} message: ${message}`);
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
