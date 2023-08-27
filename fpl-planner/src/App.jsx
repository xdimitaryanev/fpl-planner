import './App.css'
import { getPicks, getPlayerInfo, getNextGw } from './data/api'
import React, { useState, useEffect } from 'react';

function App() {
  const [userData, setUserData] = useState([]);
  const [gameWeek, setGameWeek] = useState('');
  const [userId, setUserId] = useState('');



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
          loadTeam(userId)}}>
          Load
        </button>
      </form>
      <button>-</button>
      <h1>{gameWeek}</h1>
      <button
      >+</button>
      <ul>
        {userData.map(player => (
          <li key={player[0].id}>
            {player[0].web_name} - {player[1]} - {player[2]} - {player[3]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
