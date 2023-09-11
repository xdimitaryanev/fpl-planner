async function getGeneralInfo() {
  const response = await fetch(
    `http://localhost:3001/bootstrap-static/`
  );
  return await response.json();
}

async function getUserInfo(userId) {
  const userInfo = await fetch(
    `http://localhost:3001/entry/${userId}/`
  );
  return await userInfo.json();
}

async function getUserTeamInfo(userId, gw) {
  const userTeamInfo = await fetch(
    `http://localhost:3001/entry/${userId}/event/${gw}/picks/`
  );
  return await userTeamInfo.json();
}

async function getPlayerData(playerId) {
  const playerData = await fetch(
    `http://localhost:3001/element-summary/${playerId}/`
  );
  return await playerData.json();
}

export { getGeneralInfo, getUserInfo, getUserTeamInfo, getPlayerData };
