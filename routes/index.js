const express = require("express");
const nrrCalculator = require("./nrrCalculator");
const router = express.Router();

router.use("/calculate", nrrCalculator);

module.exports = router;
