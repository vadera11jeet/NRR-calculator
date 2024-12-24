const { validationResult } = require("express-validator");
const { status } = require("http-status");
const { errorResponse } = require("../configs/responseConfig");

exports.validate = function (req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    return errorResponse(
      res,
      status.UNPROCESSABLE_ENTITY,
      errors.errors[0].msg
    );

  next();
};
