const { body } = require("express-validator");
const {
  IPL_TEAM_LIST,
  MINIMUM_NUMBER_OF_OVERS,
  MAXIMUM_NUMBER_OF_OVERS,
} = require("../configs/constants");

const nrrValidator = [
  body("teamId", "Team id is required"),

  body("oppositionTeamId", "Opposition team id is required").custom(
    (value, { req }) => {
      if (value == req.body.teamId) {
        throw new Error("Team name and opposition team name must not be same");
      }
      return true;
    }
  ),

  body("numberOfOvers", "Number of overs are required")
    .isInt({ min: MINIMUM_NUMBER_OF_OVERS, max: MAXIMUM_NUMBER_OF_OVERS })
    .withMessage(
      `Number of overs must be number and over values between ${MINIMUM_NUMBER_OF_OVERS}, ${MAXIMUM_NUMBER_OF_OVERS} `
    ),

  body("desiredPosition", "Desired Point table position is required")
    .isInt({ min: 1 })
    .withMessage(
      "Desired point table position must be Integer and greater than 0"
    ),

  body("isBattedFirst", "Batting order is required for calculation")
    .isBoolean()
    .withMessage("Is Batted order first must be boolean"),

  body("totalScoredRuns")
    .if((value, { req }) => req.body.isBattedFirst)
    .notEmpty()
    .withMessage("Total run scored is required when you have batted")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Total run scored is must be integer and non negative value"), // ignoring penalty runs

  body("targetRuns")
    .if((value, { req }) => req.body.isBattedFirst === false)
    .notEmpty()
    .withMessage("Target must not be empty when you haven't batted first")
    .bail()
    .isInt({ min: 0 })
    .withMessage("Target must be non negative integer value"),
];

module.exports = nrrValidator;
