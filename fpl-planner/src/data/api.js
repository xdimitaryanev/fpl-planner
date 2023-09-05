async function getGeneralInfo() {
  const response = await fetch(
    `https://fantasy.premierleague.com/api/bootstrap-static/`
  );
  return await response.json();
}

async function getUserInfo(userId) {
  const userInfo = await fetch(`https://fantasy.premierleague.com/api/entry/${userId}`);
  return await userInfo.json()

}

async function getUserTeamInfo(userId, gw) {
  const userTeamInfo = await fetch(
    `https://fantasy.premierleague.com/api/entry/${userId}/event/${gw}/picks/`
  );
  return await userTeamInfo.json();
}

async function getPlayerData(playerId) {
  const playerData = await fetch(`https://fantasy.premierleague.com/api/element-summary/${playerId}/`)
  return await playerData.json()
}

export {
  getGeneralInfo,
  getUserInfo,
  getUserTeamInfo,
  getPlayerData,
};
