async function getGeneralInfo() {
    const response = await fetch(`https://fantasy.premierleague.com/api/bootstrap-static/`);
    return await response.json();
}

async function getTeamInfo(id,gw) {
    const response = await fetch(`https://fantasy.premierleague.com/api/entry/${id}/event/${gw}/picks/`);
    return await response.json();
}

async function getCurrentGw() {
    const data = await getGeneralInfo();
    let events = data.events;
    const currentGw = events.find(event => event.is_current === true);
    return [currentGw.id, currentGw.deadline_time];
}

async function getPicks () {
    const userId = 423253;
    const [currentGw] = await getCurrentGw();
    const user = await getTeamInfo(userId, currentGw);
    return user.picks; // arr of user team objects
}

async function getPlayerInfo(playerId) {
    const response = await fetch(`https://fantasy.premierleague.com/api/element-summary/${playerId}/`);
    const playerFixtures = await response.json();
    const [nextFixture] = playerFixtures.fixtures
    console.log(nextFixture);
    let playerTeamId;
    playerTeamId = nextFixture.is_home ? nextFixture.team_h : nextFixture.team_a;
    console.log(playerTeamId)
    const teams = await getAllTeams();
    const playerTeam = teams.find(team => team.id === playerTeamId);
    console.log(playerTeam.name)
    const data = await getGeneralInfo();
    const player = data.elements.find(element=> element.id === playerId);
    console.log(player.web_name)
    return [player, playerTeam.name, nextFixture]; // single player object
}

async function loadTeam() {
    const team = await getPicks();
    team.forEach(element => {
        console.log(element);
        getPlayerInfo(element.element);
    });
}

async function getAllTeams() {
    const data = await getGeneralInfo();
    console.log(data.teams[0].id)
    return data.teams // arr of teams objects
}

async function getAllPlayers() {
    const data = await getGeneralInfo();
    const players = data.elements;
    return players; //arr of players objects
}

getAllPlayers()

loadTeam();

getAllTeams()

export { getGeneralInfo, getTeamInfo, getCurrentGw, getPicks, getPlayerInfo };