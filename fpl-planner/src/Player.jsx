import React, { useState } from "react";
import { render } from "react-dom";

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
    player.position === "GK"
      ? `XGC: ${player.data.expected_goals_conceded_per_90}`
      : player.position === "DEF" || player.position === "MID"
      ? `XGC: ${player.data.expected_goals_conceded_per_90} XGI: ${player.data.expected_goal_involvements_per_90}`
      : player.position === "FWD"
      ? `XGI: ${player.data.expected_goal_involvements_per_90}`
      : undefined;
  return xg;
}

function getPrice(player) {
  const price = (player.data.now_cost / 10).toFixed(1);
  return price;
}

function getNextFixture(player) {
  const fixture = player.is_next_fixture_double ? (
    <div>
      <h3 style={getDifficultyColor(player.next_fixture_difficulty[0])}>
        {player.next_fixture_opponent_team[0]}({player.next_fixture_location[0]}
        )
      </h3>
      <h3 style={getDifficultyColor(player.next_fixture_difficulty[0])}>
        {player.next_fixture_opponent_team[1]}({player.next_fixture_location[1]}
        )
      </h3>
    </div>
  ) : (
    <h3 style={getDifficultyColor(player.next_fixture_difficulty)}>
      {player.next_fixture_opponent_team}({player.next_fixture_location})
    </h3>
  );
  return fixture;
}




function Player({ player, updateSelectedPosition,handleSubstituteClick }) {
  const [showPlayer, setShowPlayer] = useState(true);
  const [showButtons, setShowButtons] = useState(true);
  const [popupVisibility, setPopupVisibility] = useState(false);

  function handleSubsClick() {
    handleSubstituteClick(player)
    setPopupVisibility(false)
  };

  function handleTransferOutClick() {
    removePlayer()
    setPopupVisibility(false)
  }


  function renderPopup(){
    return (
      <>
      <div className="transfer__popup">
        <button onClick={handleTransferOutClick}>Transfer out</button>
        <button onClick={handleSubsClick}>Substitute</button>
        <button>Make Captain</button>
        <button>Make Vice Captain</button>
        <button onClick={()=>setPopupVisibility(false)}>X</button>
      </div>
      </>
    )
  };

  function removeButtons() {
    setShowButtons(false);
  }

  function addButtons() {
    setShowButtons(true);
  }

  function removePlayer() {
    setShowPlayer(false);
    removeButtons();
    updateSelectedPosition(player.position)
  }

  function addPlayer() {
    setShowPlayer(true);
    addButtons();
  }

  return (
    <div className="player">
      {popupVisibility ? renderPopup() : null}
      {showPlayer ? (
        <>
        <div className="img__wrapper"
        onClick={()=>setPopupVisibility(true)}>
          <img
            className="player__img"
            src={
              player.data.element_type === 1
                ? `${player.team}-GK.webp`
                : `${player.team}.webp`
            }
            alt=""
          />
          <img
            className="captain__img"
            src={
              player.is_captain
                ? `circleC.png`
                : player.is_vice_captain
                ? `circleV.png`
                : null
            }
            alt=""
          />
        </div>
                  <div>
                  <h3>
                    {player.data.web_name} {getPrice(player)}£ <br />
                    {getXg(player)} <br />
                    {player.fixtures_index}
                  </h3>
                  {getNextFixture(player)}
                </div></>
      ) : (
        <div>
          <button onClick={addPlayer}>Restore</button>
        </div>
      )}
    </div>
  );
}

export default Player;
