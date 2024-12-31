const {
  defendingRunsLowerBound,
  defendingRunsUpperBound,
  chasingOverLowerBound,
  chasingOverUpperBound,
  convertBowingToPercentage,
} = require("../helpers/nrrCalculation");

const { successResponse } = require("../configs/responseConfig");
const { status } = require("http-status");

const { POINTS_TABLE } = require("../configs/constants");

exports.calculateNrr = async function (req, res, next) {
  const teamInfo = POINTS_TABLE.find(
    (team) => team.id === parseInt(req.body.teamId)
  );

  const oTeamInfo = POINTS_TABLE.find(
    (team) => team.id === parseInt(req.body.oppositionTeamId)
  );

  const [scoreRuns, battedOvers] = teamInfo.for.split("/");
  const [considerRuns, bowledOvers] = teamInfo.against.split("/");

  const [oScoreRuns, oBattedOvers] = oTeamInfo.for.split("/");
  const [oConsiderRuns, oBowledOvers] = oTeamInfo.against.split("/");
  const overs = parseInt(req.body.numberOfOvers);

  const teamScoreMatrix = {
    scoreRuns: parseInt(scoreRuns),
    battedOvers: convertBowingToPercentage(parseFloat(battedOvers)),
    considerRuns: parseInt(considerRuns),
    bowledOvers: convertBowingToPercentage(parseFloat(bowledOvers)),
  };

  const oppositionTeamScoreMatrix = {
    scoreRuns: parseInt(oScoreRuns),
    battedOvers: convertBowingToPercentage(parseFloat(oBattedOvers)),
    considerRuns: parseInt(oConsiderRuns),
    bowledOvers: convertBowingToPercentage(parseFloat(oBowledOvers)),
  };

  const desiredTeamInfo = POINTS_TABLE.find(
    (team) => team.rank === parseInt(req.body.desiredPosition)
  );

  // checking if desired team already below our current ranking
  if (desiredTeamInfo.rank > teamInfo.rank || teamInfo.rank === 1) {
    return successResponse(res, status.OK, undefined, "Just win the match");
  }

  if (teamInfo.points + 2 < desiredTeamInfo.points) {
    return successResponse(
      res,
      status.OK,
      undefined,
      "There is no chance to reach your desire position."
    );
  }

  const desiredUpperRankInfo =
    req.body.desiredPosition - 1
      ? POINTS_TABLE.find(
          (team) => team.rank === parseInt(req.body.desiredPosition) - 1
        )
      : null;

  if (req.body.isBattedFirst) {
    const scoredRuns = parseInt(req.body.totalScoredRuns);
    if (
      teamInfo.rank < oTeamInfo.rank &&
      desiredTeamInfo.rank < teamInfo.rank
    ) {
      const lowestSafeMargin = defendingRunsUpperBound(
        overs,
        scoredRuns,
        teamScoreMatrix,
        oppositionTeamScoreMatrix,
        desiredTeamInfo.nrr
      );

      const highestSafeMargin = desiredUpperRankInfo
        ? defendingRunsLowerBound(
            overs,
            scoredRuns,
            teamScoreMatrix,
            oppositionTeamScoreMatrix,
            desiredUpperRankInfo.nrr,
            lowestSafeMargin.upperBound
          )
        : null;

      return successResponse(res, status.OK, {
        lowerBound: highestSafeMargin,
        upperBound: lowestSafeMargin,
      });
    } else if (
      teamInfo.rank > oTeamInfo.rank &&
      (oTeamInfo.rank === desiredTeamInfo.rank ||
        (desiredUpperRankInfo &&
          desiredTeamInfo.rank == desiredUpperRankInfo.rank))
    ) {
      const lowestSafeMargin = defendingRunsUpperBound(
        overs,
        scoredRuns,
        teamScoreMatrix,
        oppositionTeamScoreMatrix,
        desiredTeamInfo.nrr,
        oTeamInfo.rank === desiredTeamInfo.rank
      );
      const highestSafeMargin = desiredUpperRankInfo
        ? defendingRunsLowerBound(
            overs,
            scoredRuns,
            teamScoreMatrix,
            oppositionTeamScoreMatrix,
            desiredUpperRankInfo.nrr,
            lowestSafeMargin.upperBound,
            desiredUpperRankInfo &&
              desiredTeamInfo.rank == desiredUpperRankInfo.rank
          )
        : null;

      return successResponse(res, status.OK, {
        lowerBound: highestSafeMargin,
        upperBound: lowestSafeMargin,
      });
    } else if (
      teamInfo.rank > oTeamInfo.rank &&
      oTeamInfo.rank < desiredTeamInfo.rank
    ) {
      const lowestSafeMargin = defendingRunsUpperBound(
        overs,
        scoredRuns,
        teamScoreMatrix,
        oppositionTeamScoreMatrix,
        desiredTeamInfo.nrr
      );
      const highestSafeMargin = desiredUpperRankInfo
        ? defendingRunsLowerBound(
            overs,
            scoredRuns,
            teamScoreMatrix,
            oppositionTeamScoreMatrix,
            desiredUpperRankInfo.nrr,
            lowestSafeMargin.upperBound,
            true
          )
        : null;

      return successResponse(res, status.OK, {
        lowerBound: highestSafeMargin,
        upperBound: lowestSafeMargin,
      });
    }
  } else {
    const targetRuns = parseInt(req.body.targetRuns);
    if (
      teamInfo.rank < oTeamInfo.rank &&
      desiredTeamInfo.rank < teamInfo.rank
    ) {
      const maximumSafeChasingBalls = chasingOverUpperBound(
        overs,
        targetRuns,
        teamScoreMatrix,
        oppositionTeamScoreMatrix,
        desiredTeamInfo.nrr
      );

      const minimumSafeChasingBalls = desiredUpperRankInfo
        ? chasingOverLowerBound(
            overs,
            targetRuns,
            teamScoreMatrix,
            oppositionTeamScoreMatrix,
            desiredUpperRankInfo.nrr,
            maximumSafeChasingBalls.numberOfBalls
          )
        : null;

      return successResponse(res, status.OK, {
        lowerBound: maximumSafeChasingBalls,
        upperBound: minimumSafeChasingBalls,
      });
    } else if (
      teamInfo.rank > oTeamInfo.rank &&
      (oTeamInfo.rank === desiredTeamInfo.rank ||
        (desiredUpperRankInfo && oTeamInfo.rank == desiredUpperRankInfo.rank))
    ) {
      const maximumSafeChasingBalls = chasingOverUpperBound(
        overs,
        targetRuns,
        teamScoreMatrix,
        oppositionTeamScoreMatrix,
        desiredTeamInfo.nrr,
        oTeamInfo.rank === desiredTeamInfo.rank
      );

      const minimumSafeChasingBalls = desiredUpperRankInfo
        ? chasingOverLowerBound(
            overs,
            targetRuns,
            teamScoreMatrix,
            oppositionTeamScoreMatrix,
            desiredUpperRankInfo.nrr,
            maximumSafeChasingBalls.numberOfBalls,
            desiredUpperRankInfo && oTeamInfo.rank == desiredUpperRankInfo.rank
          )
        : null;
      return successResponse(res, status.OK, {
        lowerBound: maximumSafeChasingBalls,
        upperBound: minimumSafeChasingBalls,
      });
    } else if (
      teamInfo.rank > oTeamInfo.rank &&
      oTeamInfo.rank < desiredTeamInfo.rank
    ) {
      const maximumSafeChasingBalls = chasingOverUpperBound(
        overs,
        targetRuns,
        teamScoreMatrix,
        oppositionTeamScoreMatrix,
        desiredTeamInfo.nrr
      );

      const minimumSafeChasingBalls = desiredUpperRankInfo
        ? chasingOverLowerBound(
            overs,
            targetRuns,
            teamScoreMatrix,
            oppositionTeamScoreMatrix,
            desiredUpperRankInfo.nrr,
            maximumSafeChasingBalls.numOfBalls
          )
        : null;

      return successResponse(res, status.OK, {
        lowerBound: maximumSafeChasingBalls,
        upperBound: minimumSafeChasingBalls,
      });
    }
  }
};
