const express = require("express");
const catchAsync = require("../utils/CatchAsync");
const { calculateNrr } = require("../controllers/nrrController");
const { validate } = require("../middleware");
const nrrValidator = require("../middleware/nrrInputValidator");

const router = express.Router();

router.route("/").post(nrrValidator, validate, catchAsync(calculateNrr));

module.exports = router;
