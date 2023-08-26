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
    console.log(currentGw);
    return [currentGw.id, currentGw.deadline_time];
}

async function getPicks () {
    const userId = 423253;
    const [currentGw, currentDeadline] = await getCurrentGw();
    console.log(currentGw);
    console.log(currentDeadline)
    const user = await getTeamInfo(userId, currentGw);
    return user.picks; // arr of user team objects
}

async function getPlayerInfo(playerId) {
    const data = await getGeneralInfo();
    const player = data.elements.filter(element=> element.id === playerId);
    console.log(player[0].web_name);
    return { ...player[0] }; // single player object
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
    console.log(data.teams);
    return data.teams // arr of teams objects
}

async function getAllPlayers() {
    const data = await getGeneralInfo();
    const players = data.elements;
    return players; //arr of players objects
}

async function getFixturesOfPlayer() {
    //todo
}

getAllPlayers()

loadTeam();

getAllTeams()

export { getGeneralInfo, getTeamInfo, getCurrentGw, getPicks, getPlayerInfo };