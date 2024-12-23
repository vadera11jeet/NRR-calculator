function calculateNRR(scoredRuns, battedOvers, considerRuns, bowledOvers) {
  const runRate = scoredRuns / battedOvers;
  const economyRate = considerRuns / bowledOvers;
  return runRate - economyRate;
}

function defendingRunsUpperBound(
  numberOfOvers,
  targetRuns,
  teamScoreMatrix,
  oppositionTeamScoreMatrix,
  desiredNRR,
  isOppDesired
) {
  let low = 0;
  let high = targetRuns - 1;
  let upperBound = 0;

  let { scoreRuns, battedOvers, considerRuns, bowledOvers } = teamScoreMatrix;
  let {
    scoreRuns: oTeamRuns,
    battedOvers: oTeamBattedOvers,
    considerRuns: oTeamConsiderRuns,
    bowledOvers: oTeamBowledOvers,
  } = oppositionTeamScoreMatrix;

  scoreRuns += targetRuns;
  battedOvers += numberOfOvers;
  bowledOvers += numberOfOvers;

  oTeamConsiderRuns += targetRuns;
  oTeamBowledOvers += numberOfOvers;
  oTeamBattedOvers += numberOfOvers;

  let prevMid = 0;
  let midSameCounter = 0;

  while (low < high) {
    let mid = Math.ceil(low + (high - low) / 2);
    if (mid === prevMid) midSameCounter++;
    if (midSameCounter >= 3) break;
    let teamNRR = calculateNRR(
      scoreRuns,
      battedOvers,
      considerRuns + mid,
      bowledOvers
    ).toFixed(4);
    let oTeamNRR = calculateNRR(
      oTeamRuns + mid,
      oTeamBattedOvers,
      oTeamConsiderRuns,
      oTeamBowledOvers
    ).toFixed(4);

    if (isOppDesired) {
      desiredNRR = oTeamNRR;
    }

    if (teamNRR > desiredNRR) {
      upperBound = mid;
      low = mid;
    } else {
      high = mid;
    }

    prevMid = mid;
  }

  return upperBound;
}

function defendingRunsLowerBound(
  numberOfOvers,
  targetRuns,
  teamScoreMatrix,
  oppositionTeamScoreMatrix,
  desiredNRR,
  highestSafeTotal,
  isOppDesired
) {
  let low = 0;
  let high = highestSafeTotal;
  let lowerBound = 0;

  let { scoreRuns, battedOvers, considerRuns, bowledOvers } = teamScoreMatrix;
  let {
    scoreRuns: oTeamRuns,
    battedOvers: oTeamBattedOvers,
    considerRuns: oTeamConsiderRuns,
    bowledOvers: oTeamBowledOvers,
  } = oppositionTeamScoreMatrix;

  scoreRuns += targetRuns;
  battedOvers += numberOfOvers;
  bowledOvers += numberOfOvers;

  oTeamConsiderRuns += targetRuns;
  oTeamBowledOvers += numberOfOvers;
  oTeamBattedOvers += numberOfOvers;

  let prevMid = 0;
  let midSameCounter = 0;

  while (low < high) {
    let mid = Math.ceil(low + (high - low) / 2);
    if (mid === prevMid) midSameCounter++;
    if (midSameCounter >= 3) break;
    let teamNRR = calculateNRR(
      scoreRuns,
      battedOvers,
      considerRuns + mid,
      bowledOvers
    ).toFixed(4);
    let oTeamNRR = calculateNRR(
      oTeamRuns + mid,
      oTeamBattedOvers,
      oTeamConsiderRuns,
      oTeamBowledOvers
    ).toFixed(4);

    if (isOppDesired) {
      desiredNRR = oTeamNRR;
    }

    if (teamNRR < desiredNRR) {
      lowerBound = mid;
      high = mid;
    } else {
      low = mid;
    }

    prevMid = mid;
  }

  return lowerBound;
}

function chasingOverUpperBound(
  numberOfOvers,
  targetRuns,
  teamScoreMatrix,
  oppositionTeamScoreMatrix,
  desiredNRR,
  isOppDesired
) {
  let low = safeChaseBalls ?? 0;
  let high = numberOfOvers * 6;
  let upperBound = 0;

  let { scoreRuns, battedOvers, considerRuns, bowledOvers } = teamScoreMatrix;
  let {
    scoreRuns: oTeamRuns,
    battedOvers: oTeamBattedOvers,
    considerRuns: oTeamConsiderRuns,
    bowledOvers: oTeamBowledOvers,
  } = oppositionTeamScoreMatrix;

  scoreRuns += targetRuns + 1;
  considerRuns += targetRuns;
  bowledOvers += numberOfOvers;

  oTeamRuns += targetRuns;
  oTeamBattedOvers += numberOfOvers;
  oTeamConsiderRuns += targetRuns + 1;

  let prevMid = 0;
  let midSameCounter = 0;

  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2);
    let leftBalls = (mid % 6) / 6;
    let overs = Math.floor(mid / 6) + leftBalls;

    if (mid === prevMid) midSameCounter++;
    if (midSameCounter >= 3) break;

    let teamNRR = calculateNRR(
      scoreRuns,
      battedOvers + overs,
      considerRuns,
      bowledOvers
    ).toFixed(4);

    let oTeamNRR = calculateNRR(
      oTeamRuns,
      oTeamBattedOvers,
      oTeamConsiderRuns,
      oTeamBowledOvers + overs
    ).toFixed(4);

    if (isOppDesired) {
      desiredNRR = oTeamNRR;
    }

    if (teamNRR < desiredNRR) {
      high = mid;
      upperBound = mid;
    } else {
      low = mid;
    }

    prevMid = mid;
  }

  return upperBound;
}

function chasingOverLowerBound(
  numberOfOvers,
  targetRuns,
  teamScoreMatrix,
  oppositionTeamScoreMatrix,
  desiredNRR,
  isOppDesired
) {
  let low = 0;
  let high = numberOfOvers * 6;
  let lowerBound = 0;

  let { scoreRuns, battedOvers, considerRuns, bowledOvers } = teamScoreMatrix;
  let {
    scoreRuns: oTeamRuns,
    battedOvers: oTeamBattedOvers,
    considerRuns: oTeamConsiderRuns,
    bowledOvers: oTeamBowledOvers,
  } = oppositionTeamScoreMatrix;

  scoreRuns += targetRuns + 1;
  considerRuns += targetRuns;
  bowledOvers += numberOfOvers;

  oTeamRuns += targetRuns;
  oTeamBattedOvers += numberOfOvers;
  oTeamConsiderRuns += targetRuns + 1;

  let prevMid = 0;
  let midSameCounter = 0;

  while (low < high) {
    let mid = Math.floor(low + (high - low) / 2);
    let leftBalls = (mid % 6) / 6;
    let overs = Math.floor(mid / 6) + leftBalls;

    if (mid === prevMid) midSameCounter++;
    if (midSameCounter >= 3) break;

    let teamNRR = calculateNRR(
      scoreRuns,
      battedOvers + overs,
      considerRuns,
      bowledOvers
    ).toFixed(4);

    let oTeamNRR = calculateNRR(
      oTeamRuns,
      oTeamBattedOvers,
      oTeamConsiderRuns,
      oTeamBowledOvers + overs
    ).toFixed(4);

    if (isOppDesired) {
      desiredNRR = oTeamNRR;
    }

    if (teamNRR > desiredNRR) {
      low = mid;
      upperBound = mid;
    } else {
      high = mid;
    }

    prevMid = mid;
  }

  return upperBound;
}

module.exports = {
  defendingRunsLowerBound,
  defendingRunsUpperBound,
  chasingOverUpperBound,
  chasingOverLowerBound,
};
