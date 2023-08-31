async function getGeneralInfo() {
  const response = await fetch(
    `https://fantasy.premierleague.com/api/bootstrap-static/`
  );
  return await response.json();
}

async function getUserInfo(userId, gw) {
  const response = await fetch(
    `https://fantasy.premierleague.com/api/entry/${userId}/event/${gw}/picks/`
  );
  return await response.json();
}

async function createUserInfo(userId, gw) {
    const userInfo = await getUserInfo(userId,gw)
    console.log(userInfo)
    const userInfoObject = {
        "total_points": userInfo.entry_history.total_points,
        "overall_rank": userInfo.entry_history.overall_rank,
        "gameweek_rank": userInfo.entry_history.rank,
        "event_transfers": userInfo.entry_history.event_transfers,
        "event_transfers_cost": userInfo.entry_history.event_transfers_cost,
        "user_bank": userInfo.entry_history.bank,
    }
    return userInfoObject;
}

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
  const user = await getUserInfo(userId, currentGw);
  console.log(user.picks)
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
  const playerTeamId = fixtureOfPlayer.is_home
    ? fixtureOfPlayer.team_h
    : fixtureOfPlayer.team_a;
  const playerTeam = teams.find((team) => team.id === playerTeamId);
  const [playerOpponentTeamId, isHome] = fixtureOfPlayer.is_home
    ? [fixtureOfPlayer.team_a, "H"]
    : [fixtureOfPlayer.team_h, "A"];
  const opponentTeam = teams.find((team) => team.id === playerOpponentTeamId);
  const data = await getGeneralInfo();
  const player = data.elements.find((element) => element.id === playerId);
  console.log(playerTeam)
  console.log(player)
  return [
    player,
    playerTeam.short_name,
    opponentTeam.short_name,
    isHome,
    player.chance_of_playing_next_round,
    player.expected_goals_conceded_per_90
  ];
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
  getUserInfo as getTeamInfo,
  getCurrentGw,
  getNextGw,
  getPicks,
  getFixtureOfPlayer,
  createUserInfo
};
