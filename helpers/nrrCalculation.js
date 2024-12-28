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
  let uNrr = 0;

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
      uNrr = teamNRR;
    } else {
      high = mid;
    }

    prevMid = mid;
  }

  return { upperBound, uNrr };
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
  let lNrr = 0;

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
      lNrr = teamNRR;
    } else {
      low = mid;
    }

    prevMid = mid;
  }

  return { lowerBound, lNrr };
}

function chasingOverLowerBound(
  numberOfOvers,
  targetRuns,
  teamScoreMatrix,
  oppositionTeamScoreMatrix,
  desiredNRR,
  safeChaseBalls = numberOfOvers * 6,
  isOppDesired
) {
  let low = 0;
  let high = safeChaseBalls - 1;
  let upperBound = 0;
  let uNrr = 0;

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
    } else {
      upperBound = mid;
      high = mid;
      uNrr = teamNRR;
    }

    prevMid = mid;
  }

  return {
    numOfBalls: upperBound,
    uNrr,
    upperBound: convertBallsToOver(upperBound),
  };
}

function chasingOverUpperBound(
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
  let lNrr = 0;

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
      lowerBound = mid;
      lNrr = teamNRR;
    } else {
      low = mid;
    }

    prevMid = mid;
  }

  return {
    numberOfBalls: lowerBound,
    lNrr,
    lowerBound: convertBallsToOver(lowerBound),
  };
}

function convertBowingToPercentage(bowledOvers) {
  if (bowledOvers - Math.floor(bowledOvers) > 0) {
    const deliveredBalls = Math.ceil(
      (bowledOvers - Math.floor(bowledOvers)) * 10
    );
    bowledOvers = Math.floor(bowledOvers) + deliveredBalls / 6;
  }
  return bowledOvers;
}

function convertBallsToOver(numberOfBalls) {
  const numberOFOvers = `${Math.floor(numberOfBalls / 6)}.`;
  return numberOFOvers + (numberOfBalls % 6);
}

module.exports = {
  defendingRunsLowerBound,
  defendingRunsUpperBound,
  chasingOverUpperBound,
  chasingOverLowerBound,
  convertBowingToPercentage,
  convertBallsToOver,
};
