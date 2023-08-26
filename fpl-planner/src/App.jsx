import './App.css'
import { getPicks, getPlayerInfo } from './data/api'
import React, { useState, useEffect } from 'react';

function App() {
  const [playerData, setPlayerData] = useState([]);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    const team = await getPicks();
    const playerPromises = team.map(element => getPlayerInfo(element.element));
    const playerData = await Promise.all(playerPromises);
    setPlayerData(playerData);
  };

  return (
    <div className="App">
      <h1>Football Team Players</h1>
      <ul>
        {playerData.map(player => (
          <li key={player.id}>
            {player.web_name} - {player.position}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
