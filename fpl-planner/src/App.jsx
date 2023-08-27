import './App.css'
import { getPicks, getPlayerInfo, getCurrentGw, getFixtureOfPlayer, getNextGw, createUserInfo } from './data/api'
import React, { useState, useEffect } from 'react';

function App() {
  const [userData, setUserData] = useState([]);
  const [gameWeek, setGameWeek] = useState('');
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState({});

  const loadUserInfo = async () => {
    const [currentGw] = await getCurrentGw()
    const userInfo = await createUserInfo(userId, currentGw);
    setUserInfo(userInfo)
  }

  const increaseGameWeek = () => {
    setGameWeek(prevGameWeek => prevGameWeek + 1);
  };

  const decreaseGameWeek = () => {
    setGameWeek(prevGameWeek => prevGameWeek - 1);
  };

  async function updateUserData() {
    const updatedUserData = await loadNextFixtures(userData);
    setUserData(updatedUserData);

  }

  async function handleIncreaseBtn() {
    increaseGameWeek()
    await updateUserData()
    console.log(gameWeek)
  }

  async function handleDecreaseBtn() {
    decreaseGameWeek()
    await updateUserData()
  }

  const loadNextFixtures = async (data) => {
    const playersPromises = data.map(async player => await getFixtureOfPlayer(player[0].id, gameWeek+1));
    const playersArr = await Promise.all(playersPromises);
    console.log(playersArr)
    return playersArr;
  }



  const loadTeam = async (userId) => {
    const userTeam = await getPicks(userId);
    const userPromises = userTeam.map(player => getPlayerInfo(player.element));
    const userData = await Promise.all(userPromises);
    const [nextGw] = await getNextGw();
    console.log(nextGw)
    setUserData(userData);
    setGameWeek(nextGw) 
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
        onClick={(e)=> {
          e.preventDefault()
          loadUserInfo(userId)
          loadTeam(userId)}}>
          Load
        </button>
      </form>
      <button
      onClick={handleDecreaseBtn}
      >-</button>
      <h1>{gameWeek}</h1>
      <button
      onClick={handleIncreaseBtn}

      >+</button>
<div>{userInfo.total_points} - {userInfo.overall_rank} </div>
      <ul>
        {userData.map(player => (
          <li key={player[0].id}>
            {player[0].web_name} - {player[1]} - {player[2]} - {player[3]}, {player[4]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
