import "./App.css";
import {
  getGeneralInfo,
  getUserInfo,
  getUserTeamInfo,
  getPlayerData,
} from "./data/api";
import {
  createUserInfo,
  createPlayerData,
  getCurrentGw,
  getNextGw,
  getPicks,
  getAllTeams,
  getAllPlayers,
  getAllPlayersData,
} from "./data/handleData";
import PlayersList from "./PlayersList";
import Player from "./Player";
import React, { useState, useEffect } from "react";

function App() {
  const [userData, setUserData] = useState([]);
  const [gameWeek, setGameWeek] = useState("");
  const [userId, setUserId] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [currentGw, setCurrentGw] = useState(null);
  const [isLoadBtnClicked, setIsLoadBtnClicked] = useState(false);

  const [playerPositon, setPlayerPosition] = useState();

  const [selectedPositionOption, setSelectedPositionOption] = useState("all");

  {/* FETCH USER AND PLAYERS DATA */}
  useEffect(() => { 
    async function loadFixturesOfUserTeam() {
      const playersPromises = userData.map(
        async (player) =>
          await createPlayerData(
            player.data.id,
            gameWeek,
            player.pick_order,
            player.is_captain,
            player.is_vice_captain
          )
      );
      const playersArr = await Promise.all(playersPromises);
      setUserData(playersArr);
    }
    async function fetchCurrentGw() {
      const [nextGw] = await getNextGw();
      setCurrentGw(nextGw);
    }
    loadFixturesOfUserTeam();
    fetchCurrentGw();
  }, [gameWeek]);


  {/* HANDLE GAMEWEEK NAVIGATION */}

  function increaseGameWeek() {     // GW++
    setGameWeek((prevGameWeek) => prevGameWeek + 1);
  }

  function decreaseGameWeek() {     // GW--
    setGameWeek((prevGameWeek) => prevGameWeek - 1);   
  }

  function renderBtns() {     // RENDER GAMEWEEK NAV CONDITIONALLY
    const isPrevBtnVisible = gameWeek === currentGw;
    const isNextBtnVisible = gameWeek < 38;

    return (
      <div>
        {isPrevBtnVisible ? null : (
          <button onClick={decreaseGameWeek}>PREV</button>
        )}
        {isNextBtnVisible ? (
          <button onClick={increaseGameWeek}>NEXT</button>
        ) : null}
      </div>
    );
  }

  {/* HANDLE USER INFO */}
  async function loadUserInfo() {     // FETCH USER INFO
    const [currentGw] = await getCurrentGw();
    const userInfo = await createUserInfo(userId, currentGw);
    setUserInfo(userInfo);
  }

  function renderUserInfo() {     // RENDER USER INFO
    return (
      <>
        <h2>Hello, {userInfo.name}</h2> {""}
        <h3>Total Points: {userInfo.total_points}</h3>
        <h4>Overall Rank: {userInfo.overall_rank}</h4>
      </>
    );
  }





  {/* INITIALIZE THE APP ON LOAD BUTTON CLICK */}
  const loadTeam = async (userId) => {
    getAllPlayersData();
    const [nextGw] = await getNextGw();
    const userTeam = await getPicks(userId);
    const userPromises = userTeam.map((player) =>
      createPlayerData(
        player.element,
        nextGw,
        player.position,
        player.is_captain,
        player.is_vice_captain
      )
    );
    const userData = await Promise.all(userPromises);
    setUserData(userData);
    setGameWeek(nextGw);
    setIsLoadBtnClicked(true);
  };

  // TODOO //
  function updateSelectedPosition(position) {
    setSelectedPositionOption(position);
  }

  function handleSubstituteClick(player) {
    setPlayerPosition(player.position);
  }

  function handleSubstitute(player) {
    const color = playerPositon === player.position ? "yellow" : "white";
    return { backgroundColor: color };
  }



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

      <div>
        {isLoadBtnClicked ? renderUserInfo() : null}
      </div>
      {isLoadBtnClicked ? renderBtns() : null}

<div className="app__wrapper"
> 
      {/* RENDER PITCH */}
      <div className="pitch__wrapper">

        {/* RENDER GOALKEEPER SECTION */}
        <section className="pitch__gk">
          {userData
            .filter(
              (player) =>
                player.data.element_type === 1 && player.pick_order === 1
            )
            .map((player) => (
              <div 
             
              key={player.data.id} style={handleSubstitute(player)}>
                {" "}
                <Player
                  player={player}
                  selectedPositionOption={selectedPositionOption}
                  updateSelectedPosition={updateSelectedPosition}
                />
                <button onClick={() => handleSubstituteClick(player)}>
                  Substitute
                </button>
              </div>
            ))}
        </section>

        {/* RENDER DEFENDERS SECTION */}
        <section className="pitch__def">
          {userData
            .filter(
              (player) =>
                player.data.element_type === 2 && player.pick_order <= 11
            )
            .map((player) => (
              <div key={player.data.id} style={handleSubstitute(player)}>
                {" "}
                <Player
                  player={player}
                  selectedPositionOption={selectedPositionOption}
                  updateSelectedPosition={updateSelectedPosition}
                />
                <button onClick={() => setPlayerPosition(player.position)}>
                  Substitute
                </button>
              </div>
            ))}
        </section>

        {/* RENDER MIDFIELERS SECTION */}
        <section className="pitch__mid">
          {userData
            .filter(
              (player) =>
                player.data.element_type === 3 && player.pick_order <= 11
            )
            .map((player) => (
              <div key={player.data.id} style={handleSubstitute(player)}>
                {" "}
                <Player
                  player={player}
                  selectedPositionOption={selectedPositionOption}
                  updateSelectedPosition={updateSelectedPosition}
                />
                <button onClick={() => setPlayerPosition(player.position)}>
                  Substitute
                </button>
              </div>
            ))}
        </section>

        {/* RENDER FORWARDS SECTION */}
        <section className="pitch__fwd">
          {userData
            .filter(
              (player) =>
                player.data.element_type === 4 && player.pick_order <= 11
            )
            .map((player) => (
              <div key={player.data.id} style={handleSubstitute(player)}>
                {" "}
                <Player
                  player={player}
                  selectedPositionOption={selectedPositionOption}
                  updateSelectedPosition={updateSelectedPosition}
                />
                <button onClick={() => setPlayerPosition(player.position)}>
                  Substitute
                </button>
              </div>
            ))}
        </section>

        {/* RENDER SUBS SECTION */}
        <section className="pitch__sub">
          {userData
            .filter((player) => player.pick_order > 11)
            .map((player) => (
              <div key={player.data.id} style={handleSubstitute(player)}>
                {" "}
                <Player
                  player={player}
                  selectedPositionOption={selectedPositionOption}
                  updateSelectedPosition={updateSelectedPosition}
                />
                <button onClick={() => setPlayerPosition(player.position)}>
                  Substitute
                </button>
              </div>
            ))}
        </section>
      </div>

      {/* RENDER PLAYERS LIST */}
      <div className="players__list">
        <PlayersList
          selectedPositionOption={selectedPositionOption}
          updateSelectedPosition={updateSelectedPosition}
        />
      </div>
      </div>
    </div>
  );
}

export default App;
