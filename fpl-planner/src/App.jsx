import "./App.css";
import {
  getGeneralInfo,
  getUserInfo,
  getUserTeamInfo,
  getPlayerData,
} from "./data/api";
import {createUserInfo,
  createPlayerData,
  getCurrentGw,
  getNextGw,
  getPicks,
  getAllTeams,
  getAllPlayers,} from "./data/handleData";
import Player from "./Player";
import React, { useState, useEffect } from "react";

function App() {
  const [userData, setUserData] = useState([]);
  const [gameWeek, setGameWeek] = useState("");
  const [userId, setUserId] = useState("");
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    async function loadFixturesOfUserTeam() {
      const playersPromises = userData.map(
        async (player) => await createPlayerData(player.data.id, gameWeek, player.pick_order)
      );
      const playersArr = await Promise.all(playersPromises);
      setUserData(playersArr);
    }
    loadFixturesOfUserTeam();
  }, [gameWeek]);

  function increaseGameWeek() {
    setGameWeek((prevGameWeek) => prevGameWeek + 1);
  }

function decreaseGameWeek() {
    setGameWeek((prevGameWeek) => prevGameWeek - 1);
  };

  async function loadUserInfo () {
    const [currentGw] = await getCurrentGw();
    const userInfo = await createUserInfo(userId, currentGw);
    setUserInfo(userInfo);
  };


  const loadTeam = async (userId) => {
    const [nextGw] = await getNextGw();
    const userTeam = await getPicks(userId);
    const userPromises = userTeam.map((player) =>
      createPlayerData(player.element, nextGw, player.position)
    );
    const userData = await Promise.all(userPromises);
    console.log(userData)
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
      <div className="pitch__wrapper">

      <section className="pitch__gk">
          {userData.filter((player)=> player.data.element_type === 1 && player.pick_order === 1).map((player) => (
            <Player key={player.data.id} player={player} />
          ))}
        </section>

        <section className="pitch__def">
          {userData.filter((player)=> player.data.element_type === 2 && player.pick_order <= 11).map((player) => (
            <Player key={player.data.id} player={player} />
          ))}
        </section>

        <section className="pitch__mid">
          {userData.filter((player)=> player.data.element_type === 3 && player.pick_order <= 11).map((player) => (
            <Player key={player.data.id} player={player} />
          ))}
        </section>

        <section className="pitch__fwd">
          {userData.filter((player)=> player.data.element_type === 4 && player.pick_order <= 11).map((player) => (
           <Player key={player.data.id} player={player} />
          ))}
        </section>

        <section className="pitch__sub">
          {userData.filter((player)=> player.pick_order > 11).map((player) => (
            <Player key={player.data.id} player={player} />
          ))}
        </section>

      </div>
    </div>
  );
}

export default App;
