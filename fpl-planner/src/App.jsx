import './App.css'
import { getPicks, getCurrentGw, getFixtureOfPlayer, getNextGw, createUserInfo } from './data/api'
import React, { useState, useEffect } from 'react';

function App() {
  const [userData, setUserData] = useState([]);
  const [gameWeek, setGameWeek] = useState('');
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState({});


  useEffect(() => {
    async function loadFixturesOfUserTeam() {
      const playersPromises = userData.map(async player => await getFixtureOfPlayer(player[0].id, gameWeek));
      const playersArr = await Promise.all(playersPromises);
      setUserData(playersArr)
    }
    loadFixturesOfUserTeam()
  }, [gameWeek])

  const loadUserInfo = async () => {
    const [currentGw] = await getCurrentGw()
    const userInfo = await createUserInfo(userId, currentGw);
    setUserInfo(userInfo)
  }

  function increaseGameWeek() {
    setGameWeek(prevGameWeek => prevGameWeek + 1);
  }

  const decreaseGameWeek = () => {
    setGameWeek(prevGameWeek => prevGameWeek - 1);
  }

  const loadTeam = async (userId) => {
    const [nextGw] = await getNextGw();
    const userTeam = await getPicks(userId);
    const userPromises = userTeam.map(player => getFixtureOfPlayer(player.element, nextGw ));
    const userData = await Promise.all(userPromises);
    console.log(userData)
    setUserData(prevUserData => prevUserData = userData);
    setGameWeek(prevGameWeek => prevGameWeek = nextGw) 
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
          />
        <button
        onClick={(e)=> {
          e.preventDefault()
          loadUserInfo(userId)
          loadTeam(userId)}}>
          Load
        </button>
      </form>
      <button
      onClick={decreaseGameWeek}
      >-</button>
      <h1>{gameWeek}</h1>
      <button
      onClick={increaseGameWeek}

      >+</button>
<div>{userInfo.total_points} - {userInfo.overall_rank} - {userInfo.event_transfers} - {userInfo.gameweek_rank} -{userInfo.user_bank} - {userInfo.event_transfers_cost} - </div>
      <ul>
        {userData.map(player => (
          <li key={player[0].id}>
            <img src={player[0].element_type === 1 ? `${player[1]}-GK.webp` : `${player[1]}.webp`} alt="" />
            {player[0].web_name} - {player[1]} - {player[2]} - {player[3]}, {player[5]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
