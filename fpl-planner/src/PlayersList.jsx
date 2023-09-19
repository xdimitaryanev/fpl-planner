import React, { useEffect, useState } from "react";
import { getAllPlayersData, getAllTeams } from "./data/handleData";
import Player from "./Player";

function PlayersList() {
  const [selectedSortOption, setSelectedSortOption] = useState("total-points");
  const [selectedViewOption, setSelectedViewOption] = useState("all");
  // const [currentPage, setCurrentPage] = useState(1);
  const [paginatedPlayers, setPaginatedPlayers] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const getPaginatedPlayers = async () => {
      // const playersPerPage = 30;
      // const startIndex = (currentPage - 1) * playersPerPage;
      // const endIndex = startIndex + playersPerPage;

      const allPlayers = await getAllPlayersData();
      console.log(allPlayers)
      const filteredPlayerList =
      selectedViewOption === "all"
        ? allPlayers
        : ["GK", "MID", "FWD", "DEF"].includes(selectedViewOption)
        ? allPlayers.filter((player) => player.position === selectedViewOption)
        : allPlayers.filter((player) => player.team === selectedViewOption);

      selectedSortOption === "total-points" 
      ? filteredPlayerList.sort(
        (a, b) => b.data.total_points - a.data.total_points
      ) 
      : selectedSortOption === "xgi" ? filteredPlayerList.sort(
        (a, b) => b.data.expected_goal_involvements_per_90 - a.data.expected_goal_involvements_per_90) : null


      // const players = allPlayers.slice(startIndex, endIndex);
      setPaginatedPlayers(filteredPlayerList);
    };
    const getAllTeamNames = async () => {
      const teamNames = await getAllTeams();
      setTeams(teamNames);
    };

    getAllTeamNames();
    getPaginatedPlayers();
  }, [selectedViewOption, selectedSortOption]);

  function handleSortingOption(e) {
    const sortBy = e.target.value;
    setSelectedSortOption(sortBy);
    console.log(selectedSortOption);
  }

  function handleViewOption(e) {
    const view = e.target.value;
    setSelectedViewOption(view);
    console.log(view);
  }

  return (
    <>
      <label htmlFor="position">Sort by</label>
      <select
        name="position"
        id="position"
        value={selectedSortOption}
        onChange={handleSortingOption}
      >
        <option value="total-points">Total Points</option>
        <option value="xgi">xgi</option>
      </select>

      <label htmlFor="position">View</label>
      <select
        name="position"
        id="position"
        value={selectedViewOption}
        onChange={handleViewOption}
      >
        <option value="all">All players</option>

        <optgroup label="Positions">
          <option value="GK">Goalkeepers</option>
          <option value="DEF">Defenders</option>
          <option value="MID">Midfielders</option>
          <option value="FWD">Forwards</option>
        </optgroup>

        <optgroup label="Teams">
          {console.log(teams)}
          {teams.map((team) => (
            <option value={team.short_name} key={team.code}>
              {team.name}
            </option>
          ))}
        </optgroup>
      </select>

      <div className="table__wrapper">
        <table>
          <tbody>
            <tr className="table">
              {paginatedPlayers.map((player) => (
                <td key={player.data.id}>
                  {player.data.total_points}
                  <Player player={player} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default PlayersList;
