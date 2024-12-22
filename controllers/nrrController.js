function calculateNRR(scoredRuns, battedOvers, considerRuns, bowledOvers) {
  const runRate = scoredRuns / battedOvers;
  const economyRate = considerRuns / bowledOvers;
  return runRate - economyRate;
}

function defendingRuns(
  numberOfOvers,
  targetRuns,
  teamScoreMatrix,
  oppositionTeamScoreMatrix
) {
  let low = 0;
  let high = targetRuns - 1;
  let runConsiderInWinning = 0;

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

    if (teamNRR >= oTeamNRR) {
      low = mid;
      runConsiderInWinning = mid;
    } else {
      high = mid;
    }

    prevMid = mid;
  }

  return runConsiderInWinning;
}

const teamScoreMatrix = {
  scoreRuns: 2368,
  battedOvers: 229,
  considerRuns: 2281,
  bowledOvers: 230.1,
};
const oppositionTeamScoreMatrix = {
  scoreRuns: 2333,
  battedOvers: 254.4,
  considerRuns: 2197,
  bowledOvers: 254.3,
};

// console.log(defendingRuns(20, 219, teamScoreMatrix, oppositionTeamScoreMatrix));

exports.calculateNrr = async function (req, res, next) {};
