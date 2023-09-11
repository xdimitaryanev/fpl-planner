import React, { useState } from "react";
import { getAllPlayersData } from "./data/handleData";

function PlayersList() {
  const [currentPage, setCurrentPage] = useState(1);

  const getPaginatedPlayers = async () => {
    const playersPerPage = 30;
    const startIndex = (currentPage - 1) * playersPerPage;
    const endIndex = startIndex + playersPerPage;
    const allPlayers = await getAllPlayersData();
    const paginatedPlayers = allPlayers.slice(startIndex, endIndex);
    console.log(paginatedPlayers);
    return paginatedPlayers;
  };

  const players = getPaginatedPlayers();

  return (
    <>
      <button>-</button>
      <ul>
        {players.map((player) => (
          <li>{player.team}</li>
        ))}
      </ul>
      <button>+</button>
    </>
  );
}

export default PlayersList;
