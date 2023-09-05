import { getUserInfo, getUserTeamInfo, getPlayerData, getGeneralInfo } from "./api";

async function createUserInfo(userId, gw) {
    const userInfo = await getUserInfo(userId);
    const userTeamInfo = await getUserTeamInfo(userId, gw);
    const userInfoObject = {
      user_name: userInfo.player_first_name,
      user_team_name: userInfo.name,
      total_points: userTeamInfo.entry_history.total_points,
      overall_rank: userTeamInfo.entry_history.overall_rank,
      gameweek_rank: userTeamInfo.entry_history.rank,
      event_transfers: userTeamInfo.entry_history.event_transfers,
      event_transfers_cost: userTeamInfo.entry_history.event_transfers_cost,
      user_bank: userTeamInfo.entry_history.bank,
    };
    return userInfoObject;
  }

  async function createPlayerData(playerId, gw, pickOrder) {
    const playerFixtures = await getPlayerData(playerId);
    console.log(playerFixtures.fixtures)
    const fixtureDifficultyIndex = fixtureAnalyzer(5, playerFixtures.fixtures)
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
  
    const position =
    player.element_type === 1
      ? "GK"
      : player.element_type === 2
      ? "DEF"
      : player.element_type === 3
      ? "MID"
      : player.element_type === 4
      ? "FWD"
      : "Unknown";

    const playerObj = {
      data: player,
      team: playerTeam.short_name,
      position: position,
      pick_order: pickOrder,
      fixtures: playerFixtures,
      fixtures_index: fixtureDifficultyIndex,
      next_fixture_difficulty: fixtureOfPlayer.difficulty,
      next_fixture_opponent_team: opponentTeam.short_name,
      next_fixture_location: isHome,
    };
    return playerObj;
  }

  function fixtureAnalyzer(numberOfFixtures, fixturesArr) {
    const arrLength = fixturesArr.length;
    let totalFixtureDifficulty = 0;
    if (numberOfFixtures > arrLength) {
        return;
    }
    for(let i = 0; i <= numberOfFixtures; i++) {
        const fixtureDifficulty = fixturesArr[i].difficulty;
        totalFixtureDifficulty += fixtureDifficulty;
    } 
    const indexDifficulty = totalFixtureDifficulty/numberOfFixtures;
    return indexDifficulty;
  }
  
  async function getCurrentGw() {
    const gw = await getGeneralInfo();
    let events = gw.events;
    const currentGw = events.find((event) => event.is_current === true);
    return [currentGw.id, currentGw.deadline_time];
  }
  
  async function getNextGw() {
    const nextGw = await getGeneralInfo();
    let events = nextGw.events;
    const currentGw = events.find((event) => event.is_next === true);
    return [currentGw.id, currentGw.deadline_time];
  }
  
  async function getPicks(userId) {
    const [currentGw] = await getCurrentGw();
    const user = await getUserTeamInfo(userId, currentGw);
    return user.picks; // arr of user team objects
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
    createUserInfo,
    createPlayerData,
    getCurrentGw,
    getNextGw,
    getPicks,
    getAllTeams,
    getAllPlayers,
  }