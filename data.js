async function getTeamInfo(id,gw) {
    const response = await fetch(`https://fantasy.premierleague.com/api/entry/${id}/event/${gw}/picks/`)
    return await response.json()
}

async function getPicks () {
    const teamId = 423253;
    const gw = 3;
    const team = await getTeamInfo(teamId,gw);
    return team.picks // arr of objects
}

async function getGeneralInfo() {
    const response = await fetch(`https://fantasy.premierleague.com/api/bootstrap-static/`)
    return await response.json()
}

async function getPlayerInfo(playerId) {
    const generalInfo = await getGeneralInfo()
    const player = generalInfo.elements.filter(element=> element.id === playerId)
    console.log(player[0].web_name)
}

async function getCurrentGw() {
    const info = await getGeneralInfo();
    let events = info.events
    return events.find(event => event.finished === false);
}


async function loadTeam() {
    const team = await getPicks();
    team.forEach(element => {
        console.log(element)
        getPlayerInfo(element.element)
    });
}

loadTeam()

