import { getUserInfo, getUserTeamInfo, getPlayerData, getGeneralInfo } from "./api";
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
    const team = teamsArr.find(team => team.id === teamId);
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

  async function createPlayerData(playerId, gw, pickOrder) {
    const playerFixtures = await getPlayerData(playerId);
    const fixtureDifficultyIndex = fixtureAnalyzer(gw, 5, playerFixtures.fixtures)
    const teams = await getAllTeams();

    const data = await getGeneralInfo();
    const player = data.elements.find((element) => element.id === playerId);

    const playerTeam = getTeamFromTeamId(player.team, teams);
  
    const position = getPositionOfPlayer(player);

      const fixtureOfPlayer = playerFixtures.fixtures.find(
        (fixture) => fixture.event === gw
      ); 
      if (fixtureOfPlayer === undefined) {
          return {
            data: player,
            team: playerTeam,
            position: position,
            pick_order: pickOrder,
            fixtures: playerFixtures,
            fixtures_index: fixtureDifficultyIndex,
            next_fixture_difficulty: "-",
            next_fixture_opponent_team: "-",
            next_fixture_location: "-",
          };
      }
      const [playerOpponentTeamId, isHome] = fixtureOfPlayer.is_home
        ? [fixtureOfPlayer.team_a, "H"]
        : [fixtureOfPlayer.team_h, "A"];
      const opponentTeam = teams.find((team) => team.id === playerOpponentTeamId);

    const playerObj = {
      data: player,
      team: playerTeam,
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

  async function getAllPlayersData() {
    const allTeams = await getAllTeams()
    const allPlayers = await getAllPlayers();
    const allPlayersData = allPlayers.map((player) => {
        return {
            data: player,
            team: getTeamFromTeamId(player.team,allTeams),
            position: getPositionOfPlayer(player),
        }
    } )
    console.log(allPlayersData)
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
    getAllPlayersData
  }