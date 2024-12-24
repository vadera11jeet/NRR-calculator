const { status } = require("http-status");

class AppError extends Error {
  statusCode = status.INTERNAL_SERVER_ERROR;
  status = "failed";
  isOperational;

  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
