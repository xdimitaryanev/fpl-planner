async function getGeneralInfo() {
  const response = await fetch(
    `https://fantasy.premierleague.com/api/bootstrap-static/`
  );
  return await response.json();
}

async function getTeamInfo(userId, gw) {
  const response = await fetch(
    `https://fantasy.premierleague.com/api/entry/${userId}/event/${gw}/picks/`
  );
  return await response.json();
}

async function createUserInfo(userId, gw) {
    const teamInfo = await getTeamInfo(userId,gw)
    console.log(teamInfo)
    const userInfoObject = {
        "total_points": teamInfo.entry_history.total_points,
        "overall_rank": teamInfo.entry_history.overall_rank,
        "gameweek_rank": teamInfo.entry_history.rank,
        "event_transfers": teamInfo.entry_history.event_transfers,
        "user_teamvalue": teamInfo.entry_history.value,
        "user_bank": teamInfo.entry_history.bank,
    }
    return userInfoObject;
}

createUserInfo(2,3)
async function getCurrentGw() {
  const data = await getGeneralInfo();
  let events = data.events;
  const currentGw = events.find((event) => event.is_current === true);
  return [currentGw.id, currentGw.deadline_time];
}

async function getNextGw() {
  const data = await getGeneralInfo();
  let events = data.events;
  const currentGw = events.find((event) => event.is_next === true);
  return [currentGw.id, currentGw.deadline_time];
}

async function getPicks(userId) {
  const [currentGw] = await getCurrentGw();
  const user = await getTeamInfo(userId, currentGw);
  return user.picks; // arr of user team objects
}

async function getFixtureOfPlayer(playerId, gw) {
  const response = await fetch(
    `https://fantasy.premierleague.com/api/element-summary/${playerId}/`
  );
  const playerFixtures = await response.json();
  const teams = await getAllTeams();
  const fixtureOfPlayer = playerFixtures.fixtures.find(
    (fixture) => fixture.event === gw
  );
  console.log(fixtureOfPlayer);
  const playerTeamId = fixtureOfPlayer.is_home
    ? fixtureOfPlayer.team_h
    : fixtureOfPlayer.team_a;
  const playerTeam = teams.find((team) => team.id === playerTeamId);
  const [playerOpponentTeamId, isHome] = fixtureOfPlayer.is_home
    ? [fixtureOfPlayer.team_a, "A"]
    : [fixtureOfPlayer.team_h, "H"];
  const opponentTeam = teams.find((team) => team.id === playerOpponentTeamId);
  const data = await getGeneralInfo();
  const player = data.elements.find((element) => element.id === playerId);
  return [
    player,
    playerTeam.name,
    opponentTeam.name,
    isHome,
    player.chance_of_playing_next_round,
  ];
}

async function getPlayerInfo(playerId) {
  const response = await fetch(
    `https://fantasy.premierleague.com/api/element-summary/${playerId}/`
  );
  const playerFixtures = await response.json();
  const [nextFixture] = playerFixtures.fixtures;
  const playerTeamId = nextFixture.is_home
    ? nextFixture.team_h
    : nextFixture.team_a;
  const [playerNextFixtureTeamId, isHome] = nextFixture.is_home
    ? [nextFixture.team_a, "A"]
    : [nextFixture.team_h, "H"];
  console.log(isHome);
  const teams = await getAllTeams();
  const playerTeam = teams.find((team) => team.id === playerTeamId);
  const opponentTeam = teams.find(
    (team) => team.id === playerNextFixtureTeamId
  );
  const data = await getGeneralInfo();
  const player = data.elements.find((element) => element.id === playerId);
  return [
    player,
    playerTeam.name,
    opponentTeam.name,
    isHome,
    player.chance_of_playing_next_round,
  ];
}

async function loadTeam(userId) {
  const team = await getPicks(userId);
  team.forEach((element) => {
    console.log(element);
    getPlayerInfo(element.element);
  });
}

async function getAllTeams() {
  const data = await getGeneralInfo();
  return data.teams; // arr of teams objects
}

async function getAllPlayers() {
  const data = await getGeneralInfo();
  const players = data.elements;
  return players; //arr of players objects
}

export {
  getGeneralInfo,
  getTeamInfo,
  getCurrentGw,
  getNextGw,
  getPicks,
  getPlayerInfo,
  getFixtureOfPlayer,
  createUserInfo
};
