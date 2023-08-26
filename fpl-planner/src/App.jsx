import './App.css'
import { getPicks, getPlayerInfo } from './data/api'
import React, { useState, useEffect } from 'react';

function App() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    const userTeam = await getPicks();
    const userPromises = userTeam.map(player => getPlayerInfo(player.element));
    const userData = await Promise.all(userPromises);
    setUserData(userData);
  };

  return (
    <div className="App">
      <h1>Football Team Players</h1>
      <ul>
        {userData.map(player => (
          <li key={player[0].id}>
            {player[0].web_name} - {player[1]}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
