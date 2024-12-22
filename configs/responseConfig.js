module.successResponse = function (res, statusCode, data, message) {
  res.status(statusCode).json({
    data,
    message: message,
    status: "success",
  });
};

module.errorResponse = function (res, statusCode, errorMessage) {
  if (process.env.environment === "production" && statusCode >= 500) {
    errorMessage = "internal server error";
  }

  res.status(statusCode).json({
    error: errorMessage,
    status: "failed",
  });
};
