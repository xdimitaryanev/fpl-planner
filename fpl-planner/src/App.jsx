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
  getAllPlayers,
  getAllPlayersData} from "./data/handleData";
  import PlayersList from "./PlayersList";
import Player from "./Player";
import React, { useState, useEffect } from "react";

function App() {
  const [userData, setUserData] = useState([]);
  const [gameWeek, setGameWeek] = useState("");
  const [userId, setUserId] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [currentGw, setCurrentGw] = useState(null);
  const [isLoadBtnClicked, setIsLoadBtnClicked] = useState(false)

  useEffect(() => {
    async function loadFixturesOfUserTeam() {
      const playersPromises = userData.map(
        async (player) => await createPlayerData(player.data.id, gameWeek, player.pick_order)
      );
      const playersArr = await Promise.all(playersPromises);
      console.log(playersArr)
      setUserData(playersArr);
    }
    loadFixturesOfUserTeam();
  }, [gameWeek]);

  useEffect(()=> {
    async function fetchCurrentGw() {
      const [nextGw] = await getNextGw()
      setCurrentGw(nextGw);
    } fetchCurrentGw()
  },[])

  function increaseGameWeek() {
    setGameWeek((prevGameWeek) => prevGameWeek + 1);
  }

function decreaseGameWeek() {
    setGameWeek((prevGameWeek) => prevGameWeek - 1);
  };

function renderBtns() {
  console.log(gameWeek, currentGw)
  const isPrevBtnVisible = gameWeek === currentGw;
  console.log(isPrevBtnVisible)
  const isNextBtnVisible = gameWeek < 38;
  console.log(isNextBtnVisible)

  return (
      <div>
        {isPrevBtnVisible ? null : (<button onClick={decreaseGameWeek}>PREV</button>)}
        {isNextBtnVisible ? (<button onClick={increaseGameWeek}>NEXT</button>) : null}
      </div>
    );
  };

  function renderUserInfo() {
    return (
      <>
        <h2>Hello, {userInfo.name}</h2> {""}
        <h3>Total Points: {userInfo.total_points}</h3>
        <h4>Overall Rank: {userInfo.overall_rank}</h4>
      </>
    )
  }


  async function loadUserInfo () {
    const [currentGw] = await getCurrentGw();
    const userInfo = await createUserInfo(userId, currentGw);
    setUserInfo(userInfo);
  };


  const loadTeam = async (userId) => {
    
    getAllPlayersData();
    const [nextGw] = await getNextGw();
    const userTeam = await getPicks(userId);
    const userPromises = userTeam.map((player) =>
      createPlayerData(player.element, nextGw, player.position)
    );
    const userData = await Promise.all(userPromises);
    setUserData((prevUserData) => (prevUserData = userData));
    setGameWeek((prevGameWeek) => (prevGameWeek = nextGw));
    setIsLoadBtnClicked(true)
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
          placeholder="Enter your team ID here!"
          autoFocus="autofocus"
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

      <h1>{gameWeek}</h1>
      {isLoadBtnClicked ? renderBtns() : null}
      <div>
        {isLoadBtnClicked ? renderUserInfo() : null}

        {/* {" "}
        Gameweek {gameWeek-1} Rank: {userInfo.gameweek_rank} -
        Money Remaining: {userInfo.bank}£ {""}
        {userInfo.team_name} */}
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
