import React, { useEffect, useState } from "react";
import { getAllPlayersData, getAllTeams } from "./data/handleData";
import Player from "./Player";

const excludeDuplicates = (userData, allPlayers) => {
let newArr = [...allPlayers]
for (let i=0; i < userData.length; i++) {
  const player = newArr.find(element=> element.data.id === userData[i].data.id)
  const index = newArr.indexOf(player)
  console.log(index)
  newArr.splice(index,1)
}
console.log(newArr)
return newArr
};

function PlayersList({ selectedPositionOption, updateSelectedPosition, userBank, userData, updateUserData, gameWeek }) {

  const [selectedSortOption, setSelectedSortOption] = useState("total-points");
  const [selectedTeamOption, setSelectedTeamOption] = useState("all");
  const [listOfPlayers, setListOfPlayers] = useState([]);
  const [isAffordable, setIsAffordable] = useState(false)
  const [teams, setTeams] = useState([]);


  // FETCH AND SORT AND FILTER PLAYERS LIST //
  useEffect(() => {


      const getFilteredPlayerList = async () => {
      const allPlayers = await getAllPlayersData();
        console.log(userData)
      const excludeOwnedPlayers = excludeDuplicates(userData,allPlayers)
      console.log(excludeOwnedPlayers)
      console.log(allPlayers)
      const filteredByPositionPlayerList =
        selectedPositionOption === "all"
          ? excludeOwnedPlayers
          : ["GK", "MID", "FWD", "DEF"].includes(selectedPositionOption)
          ? excludeOwnedPlayers.filter(
              (player) => player.position === selectedPositionOption
            )
          : excludeOwnedPlayers.filter(
              (player) => player.team === selectedPositionOption
            );


      // SORT BY... //
      selectedSortOption === "total-points"     // DEFAULT SORT BY TOTAL POINTS
        ? filteredByPositionPlayerList.sort(
            (a, b) => b.data.total_points - a.data.total_points
          )
        : selectedSortOption === "xgi"      // SORT BY PRICE XGI PER 90
        ? filteredByPositionPlayerList.sort(
            (a, b) =>
              b.data.expected_goal_involvements_per_90 -
              a.data.expected_goal_involvements_per_90
          )
        : selectedSortOption === "xgc"      // SORT BY PRICE XGC PER 90
        ? filteredByPositionPlayerList.sort(
            (a, b) =>
              b.data.expected_goals_conceded_per_90 -
              a.data.expected_goals_conceded_per_90
          )
        : selectedSortOption === "price-hl"     // SORT BY PRICE HIGH TO LOW
        ? filteredByPositionPlayerList.sort(
            (a, b) => b.data.now_cost - a.data.now_cost
          )
        : selectedSortOption === "price-lh"     // SORT BY PRICE LOW TO HIGH
        ? filteredByPositionPlayerList.sort(
            (a, b) => a.data.now_cost - b.data.now_cost
          )
        : null;

      // FILTER BY TEAM //
      const filteredPlayerList =
        selectedTeamOption === "all" // DEFAULT
          ? filteredByPositionPlayerList
          : filteredByPositionPlayerList.filter(
              (player) => player.team === selectedTeamOption
            );
      const isPlayerAffordable = isAffordable ? filteredPlayerList.filter((player) => player.data.now_cost <= userBank) : filteredPlayerList
      setListOfPlayers(isPlayerAffordable);
    };

    // FETCH ALL TEAM NAMES //
    const getAllTeamNames = async () => {
      const teamNames = await getAllTeams();
      setTeams(teamNames);
    };
    getAllTeamNames();
    getFilteredPlayerList();
  }, [selectedTeamOption, selectedSortOption, selectedPositionOption, isAffordable, userBank,userData]);

  // HANDLE ONCHANGE EVENTS //
  function handleSortingOption(e) {
    const sortBy = e.target.value;
    setSelectedSortOption(sortBy);
  }

  function handleTeamOption(e) {
    const team = e.target.value;
    setSelectedTeamOption(team);
  }

  function handlePositionOption(e) {
    const position = e.target.value;
    updateSelectedPosition(position);
  }

  function handleAffordable(e) {
    setIsAffordable(e.target.checked)
    setSelectedSortOption("price-hl") 
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
      <div>
      <input onChange={handleAffordable} type="checkbox" id="scales" name="Affordable" />
    <label htmlFor="scales">Affordable</label>
  </div>

      <div className="table__wrapper">
        <table>
          <tbody>
            <tr className="table">
              {listOfPlayers.map((player) => (
                <td key={player.data.id}>
                  {player.data.total_points}
                  <Player player={player} userData={userData} updateUserData={updateUserData} gameWeek={gameWeek} />
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
