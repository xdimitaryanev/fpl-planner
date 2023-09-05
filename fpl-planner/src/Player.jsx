import React from "react";

const getDifficultyColor = (fixtureDifficulty) => {
  const color =
    fixtureDifficulty === 1
      ? "rgb(1, 252, 122)"
      : fixtureDifficulty === 2
      ? "rgb(1, 252, 122)"
      : fixtureDifficulty === 3
      ? "rgb(231, 231, 231)"
      : fixtureDifficulty === 4
      ? "rgb(255, 23, 81)"
      : fixtureDifficulty === 5
      ? "rgb(128, 7, 45)"
      : undefined;
  return { backgroundColor: color };
};

function getXg(player) {
  const xg =
    player.playerPosition === "GK"
      ? `XGC: ${player.data.expected_goals_conceded_per_90}`
      : player.position === "DEF" || player.position === "MID"
      ? `XGC: ${player.data.expected_goals_conceded_per_90} XGI: ${player.data.expected_goal_involvements_per_90}`
      : player.position === "FWD"
      ? `XGI: ${player.data.expected_goal_involvements_per_90}`
      : undefined;
  return xg;
}

function getPrice(player) {
    const price = (player.data.now_cost/10).toFixed(1);
    return price;
}

function getNextFixture(player) {
    const fixture = `${player.next_fixture_opponent_team}(${player.next_fixture_location})`
    return fixture;
}

function Player({ player }) {
  return (
    <div id="player">
      <img
        src={
          player.data.element_type === 1
            ? `${player.team}-GK.webp`
            : `${player.team}.webp`
        }
        alt=""
      />
      <div>
        <h3>
          {player.data.web_name} {" "}
          {getPrice(player)}£ <br />
          {getXg(player)}
        </h3>
        <h4 style={getDifficultyColor(player.next_fixture_difficulty)}>
          {getNextFixture(player)}
        </h4>
      </div>
    </div>
  );
}

{
  /* <svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  role="img"
  focusable="false"
  class="TeamPitchElement__StyledCaptain-sc-202u14-1 kemjNJ"
>
  <title>Captain</title>
  <circle cx="12" cy="12" r="12" aria-hidden="true"></circle>
  <path
    d="M15.0769667,14.370341 C14.4472145,15.2780796 13.4066319,15.8124328 12.3019667,15.795341 C10.4380057,15.795341 8.92696674,14.284302 8.92696674,12.420341 C8.92696674,10.55638 10.4380057,9.045341 12.3019667,9.045341 C13.3988206,9.06061696 14.42546,9.58781014 15.0769667,10.470341 L17.2519667,8.295341 C15.3643505,6.02401882 12.1615491,5.35094208 9.51934028,6.67031017 C6.87713147,7.98967826 5.49079334,10.954309 6.17225952,13.8279136 C6.8537257,16.7015182 9.42367333,18.7279285 12.3769667,18.720341 C14.2708124,18.7262708 16.0646133,17.8707658 17.2519667,16.395341 L15.0769667,14.370341 Z"
    fill="currentColor"
    aria-hidden="true"
  ></path>
</svg>; */
}

export default Player;
