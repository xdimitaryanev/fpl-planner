async function getGeneralInfo() {
    const response = await fetch(`https://fantasy.premierleague.com/api/bootstrap-static/`);
    return await response.json();
}

async function getTeamInfo(id,gw) {
    const response = await fetch(`https://fantasy.premierleague.com/api/entry/${id}/event/${gw}/picks/`);
    return await response.json();
}

async function getNextGw() {
    const data = await getGeneralInfo();
    let events = data.events;
    const currentGw = events.find(event => event.is_current === true);
    return [currentGw.id, currentGw.deadline_time];
}

async function getPicks (userId) {
    const [nextGw] = await getNextGw();
    const user = await getTeamInfo(userId, nextGw);
    return user.picks; // arr of user team objects
}

async function getPlayerInfo(playerId) {
    const response = await fetch(`https://fantasy.premierleague.com/api/element-summary/${playerId}/`);
    const playerFixtures = await response.json();
    const [nextFixture] = playerFixtures.fixtures
    const playerTeamId = nextFixture.is_home ? nextFixture.team_h : nextFixture.team_a;
    const [playerNextFixtureTeamId, isHome] = nextFixture.is_home ? [nextFixture.team_a, "A" ] : [nextFixture.team_h, "H"];
    console.log(isHome)
    const teams = await getAllTeams();
    const playerTeam = teams.find(team => team.id === playerTeamId);
    const oponentTeam = teams.find(team => team.id === playerNextFixtureTeamId);
    const data = await getGeneralInfo();
    const player = data.elements.find(element=> element.id === playerId);
    return [player, playerTeam.name, oponentTeam.name, isHome];
}

async function loadTeam(userId) {
    const team = await getPicks(userId);
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

export { getGeneralInfo, getTeamInfo, getNextGw, getPicks, getPlayerInfo };