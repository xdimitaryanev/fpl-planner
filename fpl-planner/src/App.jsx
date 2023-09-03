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
        async (player) => await getPlayerData(player.playerData.id, gameWeek, player.pickOrder)
      );
      const playersArr = await Promise.all(playersPromises);
      setUserData(playersArr);
    }
    loadFixturesOfUserTeam();
  }, [gameWeek]);

  const setDifficultyColor = (fixtureDifficulty) => {
    const color = fixtureDifficulty === 3 ? "red" : undefined
    return {backgroundColor: color}
  }

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
      <div className="pitch__wrapper">
      {/* <img className="pitch__img"  src="pitch.png" alt="" /> */}

      <section className="pitch__gk">
          {userData.filter((player)=> player.playerData.element_type === 1 && player.pickOrder === 1).map((player) => (
            <div
              id="player"
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
              <div style={setDifficultyColor(player.nextFixtureDifficulty)}>
              <h3>{player.playerData.web_name}</h3>  
              <h4>{player.playerNextFixtureOpponentTeam} ({player.playerNextFixtureLocation})</h4>   
              </div>
            </div>
          ))}
        </section>

        <section className="pitch__def">
          {userData.filter((player)=> player.playerData.element_type === 2 && player.pickOrder <= 11).map((player) => (
            <div
              id="player"
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
              <div>
              <h3>{player.playerData.web_name}</h3>  
              <h4>{player.playerNextFixtureOpponentTeam} ({player.playerNextFixtureLocation})</h4>   
              </div>
            </div>
          ))}
        </section>

        <section className="pitch__mid">
          {userData.filter((player)=> player.playerData.element_type === 3 && player.pickOrder <= 11).map((player) => (
            <div
              id="player"
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
              <div>
              <h3>{player.playerData.web_name}</h3>  
              <h4>{player.playerNextFixtureOpponentTeam} ({player.playerNextFixtureLocation}) {player.nextFixtureDifficulty}</h4>   
              </div>
            </div>
          ))}
        </section>

        <section className="pitch__fwd">
          {userData.filter((player)=> player.playerData.element_type === 4 && player.pickOrder <= 11).map((player) => (
            <div
              id="player"
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
              <div>
              <h3>{player.playerData.web_name}</h3>  
              <h4>{player.playerNextFixtureOpponentTeam} ({player.playerNextFixtureLocation})</h4>   
              </div>
            </div>
          ))}
        </section>

        <section className="pitch__sub">
          {userData.filter((player)=> player.pickOrder > 11).map((player) => (
            <div
              id="player"
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
              <div>
              <h3>{player.playerData.web_name}</h3>  
              <h4>{player.playerNextFixtureOpponentTeam} ({player.playerNextFixtureLocation}) {player.nextFixtureDifficulty}</h4>   
              </div>

              
              
            </div>
          ))}
        </section>

      </div>
    </div>
  );
}

export default App;
