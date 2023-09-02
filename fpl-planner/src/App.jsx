import "./App.css";
import {
  getPicks,
  getCurrentGw,
  getPlayerData,
  getNextGw,
  createUserInfo,
} from "./data/api";
import React, { useState, useEffect } from "react";

function App() {
  const [userData, setUserData] = useState([]);
  const [gameWeek, setGameWeek] = useState("");
  const [userId, setUserId] = useState("");
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    async function loadFixturesOfUserTeam() {
      const playersPromises = userData.map(
        async (player) => await getPlayerData(player.playerData.id, gameWeek)
      );
      const playersArr = await Promise.all(playersPromises);
      setUserData(playersArr);
    }
    loadFixturesOfUserTeam();
  }, [gameWeek]);

  const loadUserInfo = async () => {
    const [currentGw] = await getCurrentGw();
    const userInfo = await createUserInfo(userId, currentGw);
    setUserInfo(userInfo);
  };

  function increaseGameWeek() {
    setGameWeek((prevGameWeek) => prevGameWeek + 1);
  }

  const decreaseGameWeek = () => {
    setGameWeek((prevGameWeek) => prevGameWeek - 1);
  };

  const loadTeam = async (userId) => {
    const [nextGw] = await getNextGw();
    const userTeam = await getPicks(userId);
    console.log(userTeam);
    const userPromises = userTeam.map((player) =>
      getPlayerData(player.element, nextGw, player.position)
    );
    const userData = await Promise.all(userPromises);
    console.log(userData);
    setUserData((prevUserData) => (prevUserData = userData));
    setGameWeek((prevGameWeek) => (prevGameWeek = nextGw));
  };

  return (
    <div className="App">
      <form className="input-form">
        <label htmlFor="teamId">Team ID</label>
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          type="number"
          id="teamId"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            loadUserInfo(userId);
            loadTeam(userId);
          }}
        >
          Load
        </button>
      </form>
      <button onClick={decreaseGameWeek}>-</button>
      <h1>{gameWeek}</h1>
      <button onClick={increaseGameWeek}>+</button>
      <div>
        {userInfo.total_points} - {userInfo.overall_rank} -{" "}
        {userInfo.event_transfers} - {userInfo.gameweek_rank} -
        {userInfo.user_bank} - {userInfo.event_transfers_cost} -{" "}
      </div>
      <div className="pitch">
        <ul>
          {userData.map((player) => (
            <li
            className={
              player.playerData.element_type === 1 && player.pickOrder === 1
                ? "gk"
                : player.playerData.element_type === 2 &&
                  player.pickOrder <= 11
                ? "def"
                : player.playerData.element_type === 3 &&
                  player.pickOrder <= 11
                ? "mid"
                : player.playerData.element_type === 4 &&
                  player.pickOrder <= 11
                ? "fwd"
                : "sub"
            }
              key={player.playerData.id}
            >
              <img
                src={
                  player.playerData.element_type === 1
                    ? `${player.playerTeam}-GK.webp`
                    : `${player.playerTeam}.webp`
                }
                alt=""
              />
              {player.playerData.web_name} - {player.playerTeam} -{" "}
              {player.playerNextFixtureOpponentTeam} -{" "}
              {player.playerNextFixtureLocation}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
