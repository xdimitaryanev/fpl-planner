import {
  getUserInfo,
  getUserTeamInfo,
  getPlayerData,
  getGeneralInfo,
} from "./api";
import fixtureAnalyzer from "../tools/fixtureAnalyzer";

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

function getTeamFromTeamId(teamId, teamsArr) {
  const team = teamsArr.find((team) => team.id === teamId);
  return team.short_name;
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

function getPositionOfPlayer(player) {
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
  return position;
}

async function createUserInfo(userId, gw) {
  const userInfo = await getUserInfo(userId);
  const userTeamInfo = await getUserTeamInfo(userId, gw);
  const userInfoObject = {
    name: userInfo.player_first_name,
    team_name: userInfo.name,
    total_points: userTeamInfo.entry_history.total_points,
    overall_rank: userTeamInfo.entry_history.overall_rank,
    gameweek_rank: userTeamInfo.entry_history.rank,
    event_transfers: userTeamInfo.entry_history.event_transfers,
    event_transfers_cost: userTeamInfo.entry_history.event_transfers_cost,
    bank: userTeamInfo.entry_history.bank,
  };
  return userInfoObject;
}

async function createPlayerData(
  playerId,
  gw,
  pickOrder,
  isCaptain,
  isViceCaptain
) {
  const playerFixtures = await getPlayerData(playerId);
  const fixtureDifficultyIndex = fixtureAnalyzer(
    gw,
    5,
    playerFixtures.fixtures
  );
  const teams = await getAllTeams();

  const data = await getGeneralInfo();
  const player = data.elements.find((element) => element.id === playerId);
  const playerTeam = getTeamFromTeamId(player.team, teams);

  const position = getPositionOfPlayer(player);

  const fixtureOfPlayer = playerFixtures.fixtures.filter(
    (fixture) => fixture.event === gw
  );
  if (fixtureOfPlayer.length < 1) {
    return {
      data: player,
      team: playerTeam,
      position: position,
      pick_order: pickOrder,
      is_captain: isCaptain,
      is_vice_captain: isViceCaptain,
      fixtures: playerFixtures,
      fixtures_index: fixtureDifficultyIndex,
      is_next_fixture_blank: true,
      is_next_fixture_double: false,
      next_fixture_difficulty: "-",
      next_fixture_opponent_team: "-",
      next_fixture_location: "-",
    };
  } else if (fixtureOfPlayer.length === 1) {
    const [playerOpponentTeamId, location] = fixtureOfPlayer[0].is_home
      ? [fixtureOfPlayer[0].team_a, "H"]
      : [fixtureOfPlayer[0].team_h, "A"];
    const opponentTeam = teams.find((team) => team.id === playerOpponentTeamId);

    return {
      data: player,
      team: playerTeam,
      position: position,
      pick_order: pickOrder,
      is_captain: isCaptain,
      is_vice_captain: isViceCaptain,
      fixtures: playerFixtures,
      fixtures_index: fixtureDifficultyIndex,
      is_next_fixture_blank: false,
      is_next_fixture_double: false,
      next_fixture_difficulty: fixtureOfPlayer[0].difficulty,
      next_fixture_opponent_team: opponentTeam.short_name,
      next_fixture_location: location,
    };
  } else if (fixtureOfPlayer.length === 2) {
    const locations = [];
    const opponentsTeam = [];
    fixtureOfPlayer.forEach((fixture) => {
      const [playerOpponentTeamId, location] = fixture.is_home
        ? [fixture.team_a, "H"]
        : [fixture.team_h, "A"];
      const opponentTeam = teams.find(
        (team) => team.id === playerOpponentTeamId
      );
      opponentsTeam.push(opponentTeam);
      locations.push(location);
    });
    return {
      data: player,
      team: playerTeam,
      position: position,
      pick_order: pickOrder,
      is_captain: isCaptain,
      is_vice_captain: isViceCaptain,
      fixtures: playerFixtures,
      fixtures_index: fixtureDifficultyIndex,
      is_next_fixture_blank: false,
      is_next_fixture_double: true,
      next_fixture_difficulty: [
        fixtureOfPlayer[0].difficulty,
        fixtureOfPlayer[1].difficulty,
      ],
      next_fixture_opponent_team: [
        opponentsTeam[0].short_name,
        opponentsTeam[1].short_name,
      ],
      next_fixture_location: [locations[0], locations[1]],
    };
  }
}

async function getAllPlayersData() {
  const allTeams = await getAllTeams();
  const allPlayers = await getAllPlayers();
  const allPlayersData = allPlayers.map((player) => {
    return {
      data: player,
      team: getTeamFromTeamId(player.team, allTeams),
      position: getPositionOfPlayer(player),
    };
  });

  return allPlayersData;
}

export {
  createUserInfo,
  createPlayerData,
  getCurrentGw,
  getNextGw,
  getPicks,
  getAllTeams,
  getAllPlayers,
  getAllPlayersData,
};
