import React, { useEffect, useState } from "react";
import { getAllPlayersData, getAllTeams } from "./data/handleData";
import Player from "./Player";

function PlayersList() {
  const [selectedSortOption, setSelectedSortOption] = useState("total-points");
  const [selectedTeamOption, setSelectedTeamOption] = useState("all");
  const [selectedPositionOption, setSelectedPositionOption] = useState("all");
  const [paginatedPlayers, setPaginatedPlayers] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const getFilteredPlayerList = async () => {
      const allPlayers = await getAllPlayersData();
      console.log(allPlayers);
      const filteredByPositionPlayerList =
      selectedPositionOption === "all"
          ? allPlayers
          : ["GK", "MID", "FWD", "DEF"].includes(selectedPositionOption)
          ? allPlayers.filter(
              (player) => player.position === selectedPositionOption
            )
          : allPlayers.filter((player) => player.team === selectedPositionOption);


      selectedSortOption === "total-points"
        ? filteredByPositionPlayerList.sort(
            (a, b) => b.data.total_points - a.data.total_points
          )
        : selectedSortOption === "xgi"
        ? filteredByPositionPlayerList.sort(
            (a, b) =>
              b.data.expected_goal_involvements_per_90 -
              a.data.expected_goal_involvements_per_90
          )
        : selectedSortOption === "xgc"
        ? filteredByPositionPlayerList.sort(
          (a, b) =>
            b.data.expected_goals_conceded_per_90 -
            a.data.expected_goals_conceded_per_90
        ) : selectedSortOption === "price-hl" ? filteredByPositionPlayerList.sort(
          (a, b) =>
            b.data.now_cost -
            a.data.now_cost
        ) : selectedSortOption === "price-lh" ? 
        filteredByPositionPlayerList.sort(
          (a, b) =>
            a.data.now_cost -
            b.data.now_cost
        ) : null

        const filteredPlayerList =
        selectedTeamOption === "all"
          ? filteredByPositionPlayerList
          : filteredByPositionPlayerList.filter(
              (player) => player.team === selectedTeamOption
            )

      setPaginatedPlayers(filteredPlayerList);
    };
    const getAllTeamNames = async () => {
      const teamNames = await getAllTeams();
      setTeams(teamNames);
    };

    getAllTeamNames();
    getFilteredPlayerList();
  }, [selectedTeamOption, selectedSortOption, selectedPositionOption]);

  function handleSortingOption(e) {
    const sortBy = e.target.value;
    setSelectedSortOption(sortBy);
    console.log(selectedSortOption);
  }

  function handleTeamOption(e) {
    const team = e.target.value;
    setSelectedTeamOption(team);
    console.log(team);
  }

  function handlePositionOption(e) {
    const position = e.target.value;
    setSelectedPositionOption(position)
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
        <option value="xgi">XGI per 90</option>
        <option value="xgc">XGC per 90</option>
        <option value="price-lh">Price low to high</option>
        <option value="price-hl">Price High to low</option>
      </select>



      <label htmlFor="team">Team</label>
      <select
        name="team"
        id="team"
        value={selectedPositionOption}
        onChange={handlePositionOption}
      >
          <option value="all">All players</option>
          <option value="GK">Goalkeepers</option>
          <option value="DEF">Defenders</option>
          <option value="MID">Midfielders</option>
          <option value="FWD">Forwards</option>
      </select>

      <label htmlFor="position">Position</label>
      <select
        name="position"
        id="position"
        value={selectedTeamOption}
        onChange={handleTeamOption}
      >
        <option value="all">All players</option>
  {teams.map((team) => (
            <option value={team.short_name} key={team.code}>
              {team.name}
            </option>
          ))}

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
