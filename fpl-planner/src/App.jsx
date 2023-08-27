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
    console.log(userInfo)
    console.log(userInfo.total_points)
  }


  const increaseGameWeek = async (e) => {
    e.preventDefault();
    setGameWeek(prevGameWeek => prevGameWeek + 1);
    const updatedUserData = await loadNextFixtures(userData);
    setUserData(updatedUserData);
  };

  const decreaseGameWeek = async (e) => {
    e.preventDefault();
    setGameWeek(prevGameWeek => prevGameWeek - 1);
    const updatedUserData = await loadNextFixtures(userData);
    setUserData(updatedUserData);
  };

  const loadNextFixtures = async () => {
    const playersPromises = userData.map(async player => await getFixtureOfPlayer(player[0].id, gameWeek));
    const playersArr = await Promise.all(playersPromises);
    console.log(playersArr)
    return playersArr;
  }



  const loadTeam = async (userId) => {
    const userTeam = await getPicks(userId);
    const userPromises = userTeam.map(player => getPlayerInfo(player.element));
    const userData = await Promise.all(userPromises);
    const [nextGw] = await getNextGw();
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
      onClick={decreaseGameWeek}
      >-</button>
      <h1>{gameWeek}</h1>
      <button
      onClick={increaseGameWeek}

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
