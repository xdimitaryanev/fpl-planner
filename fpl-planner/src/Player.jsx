import React from "react";

const setDifficultyColor = (fixtureDifficulty) => {
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

function Player({ player }) {
  return (
    <div id="player" key={player.playerData.id}>
      <img
        src={
          player.playerData.element_type === 1
            ? `${player.playerTeam}-GK.webp`
            : `${player.playerTeam}.webp`
        }
        alt=""
      />
      <div>
        <h3>{player.playerData.web_name}</h3>
        <h4 style={setDifficultyColor(player.nextFixtureDifficulty)}>
          {player.playerNextFixtureOpponentTeam} (
          {player.playerNextFixtureLocation})
        </h4>
      </div>
    </div>
  );
}

export default Player;
