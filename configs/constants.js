const POINTS_TABLE = [
  {
    id: 1,
    rank: 1,
    team: "Chennai Super Kings",
    matches: 7,
    won: 5,
    lost: 2,
    nrr: 0.771,
    for: "1130/133.1",
    against: "1071/138.5",
    points: 10,
  },
  {
    id: 2,
    rank: 2,
    team: "Royal Challengers Bangalore",
    matches: 7,
    won: 4,
    lost: 3,
    nrr: 0.597,
    for: "1217/140",
    against: "1066/131.4",
    points: 8,
  },
  {
    id: 3,
    rank: 3,
    team: "Delhi Capitals",
    matches: 7,
    won: 4,
    lost: 3,
    nrr: 0.319,
    for: "1085/126",
    against: "1136/137",
    points: 8,
  },
  {
    id: 4,
    rank: 4,
    team: "Rajasthan Royals",
    matches: 7,
    won: 3,
    lost: 4,
    nrr: 0.331,
    for: "1066/128.2",
    against: "1094/137.1",
    points: 6,
  },
  {
    id: 5,
    rank: 5,
    team: "Mumbai Indians",
    matches: 8,
    won: 2,
    lost: 6,
    nrr: -1.75,
    for: "1003/155.2",
    against: "1134/138.1",
    points: 4,
  },
];

exports.IPL_TEAM_LIST = POINTS_TABLE.map((team) => team.team.toLowerCase());

exports.POINTS_TABLE = POINTS_TABLE;
exports.MINIMUM_NUMBER_OF_OVERS = 20;

exports.MAXIMUM_NUMBER_OF_OVERS = 50;

exports.POINTS_TABLE = POINTS_TABLE;
