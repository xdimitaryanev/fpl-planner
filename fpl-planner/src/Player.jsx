import React, { useState } from "react";
import { getFixturesOfPlayer } from "./data/handleData";
import { createPlayerData } from "./data/handleData";

const getFixtureDifficultyColor = (fixtureDifficulty) => {
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

function renderNextFixture(player) {
  const fixture = player.is_next_fixture_double ? (
    <div className="fixtures__wrapper">
      <h3 style={getFixtureDifficultyColor(player.next_fixture_difficulty[0])}>
        {player.next_fixture_opponent_team[0]}({player.next_fixture_location[0]}
        )
      </h3>
      <h3 style={getFixtureDifficultyColor(player.next_fixture_difficulty[1])}>
        {player.next_fixture_opponent_team[1]}({player.next_fixture_location[1]}
        )
      </h3>
    </div>
  ) : (
    <h3 style={getFixtureDifficultyColor(player.next_fixture_difficulty)}>
      {player.next_fixture_opponent_team}({player.next_fixture_location})
    </h3>
  );
  return fixture;
}

function Player({
  player,
  updateSelectedPosition,
  handleSubstituteClick,
  updateUserBank,
  restoreUserBank,
  userData,
  updateUserData,
  gameWeek
}) {
  const [showPlayer, setShowPlayer] = useState(true);
  const [showButtons, setShowButtons] = useState(true);
  const [removePlayerPopupVisibility, setRemovePlayerPopupVisibility] =
    useState(false);
  const [restorePlayerPopupVisibility, setRestorePlayerPopupVisibility] =
    useState(false);

  function handleSubsClick() {
    handleSubstituteClick(player);
    setRemovePlayerPopupVisibility(false);
  }

  function handleTransferOutClick() {
    removePlayer();
    setRemovePlayerPopupVisibility(false);
    setRestorePlayerPopupVisibility(false);
    handleTransferOutData();
  }

  async function addPlayer(player) {
    const userDataArr = [...userData];
    const filteredUserData = userDataArr.filter((data)=> data.transfer_out === true)
    if (filteredUserData.length > 0) {
      const playerToReplace = filteredUserData.find((data)=> data.position === player.position)
      const indexOfPlayerToReplace = userDataArr.indexOf(playerToReplace)
      const playerData = await createPlayerData(
        player.data.id,
        gameWeek,
        playerToReplace.pick_order,
        playerToReplace.is_captain,
        playerToReplace.is_vice_captain
      )
      console.log(playerData)
      console.log(indexOfPlayerToReplace)
      userDataArr[indexOfPlayerToReplace] = {...userDataArr[indexOfPlayerToReplace], ...playerData, ...{transfer_out: false}}
      updateUserData(userDataArr);
      console.log(userDataArr)
    }


  }

  function handleTransferOutData() {
    const data = { transfer_out: true };
    const userDataArr = [...userData];
    const playerIndex = userDataArr.findIndex(
      (data) => data.data.id === player.data.id
    );
    if (playerIndex !== -1) {
      userDataArr[playerIndex] = { ...userDataArr[playerIndex], ...data };
    }
    updateUserData(userDataArr);
  }
  function handleRestoreData() {
    const data = { transfer_out: false };
    const userDataArr = [...userData];

    const playerIndex = userDataArr.findIndex(
      (item) => item.data.id === player.data.id
    );

    if (playerIndex !== -1) {
      userDataArr[playerIndex] = {
        ...userDataArr[playerIndex],
        data: {
          ...userDataArr[playerIndex].data,
          ...data,
        },
      };
    }
    updateUserData(userDataArr);
  }

  function handleCaptainData(player) {
    const dataViceFalse = { is_vice_captain: false };
    const dataViceTrue = { is_vice_captain: true };
    const dataCaptainFalse = { is_captain: false };
    const dataCaptainTrue = { is_captain: true };
    const userDataArr = [...userData];
    const oldCaptainIndex = userDataArr.findIndex(
      (data) => data.is_captain === true
    );
    const viceCaptainIndex = userDataArr.findIndex(
      (data) => data.is_vice_captain === true
    );
    const newCaptainIndex = userDataArr.findIndex(
      (data) => data.data.id === player.data.id
    );
    if (oldCaptainIndex !== -1) {
      userDataArr[oldCaptainIndex] = {
        ...userDataArr[oldCaptainIndex],
        ...dataCaptainFalse,
      };
    }
    if (newCaptainIndex !== -1) {
      userDataArr[newCaptainIndex] = {
        ...userDataArr[newCaptainIndex],
        ...dataCaptainTrue,
      };
      if (newCaptainIndex === viceCaptainIndex) {
        userDataArr[viceCaptainIndex] = {
          ...userDataArr[viceCaptainIndex],
          ...dataViceFalse,
        };
        userDataArr[oldCaptainIndex] = {
          ...userDataArr[oldCaptainIndex],
          ...dataViceTrue,
        };
      }
    }
    updateUserData(userDataArr);
  }

  function handleViceCaptainData(player) {
    const dataViceFalse = { is_vice_captain: false };
    const dataViceTrue = { is_vice_captain: true };
    const dataCaptainFalse = { is_captain: false };
    const dataCaptainTrue = { is_captain: true };
    const userDataArr = [...userData];
    const captainIndex = userDataArr.findIndex(
      (data) => data.is_captain === true
    );
    const newViceCaptainIndex = userDataArr.findIndex(
      (data) => data.data.id === player.data.id
    );
    const oldViceCaptainIndex = userDataArr.findIndex(
      (data) => data.is_vice_captain === true
    );
    if (oldViceCaptainIndex !== -1) {
      userDataArr[oldViceCaptainIndex] = {
        ...userDataArr[oldViceCaptainIndex],
        ...dataViceFalse,
      };
    }
    if (newViceCaptainIndex !== -1) {
      userDataArr[newViceCaptainIndex] = {
        ...userDataArr[newViceCaptainIndex],
        ...dataViceTrue,
      };
      if (newViceCaptainIndex === captainIndex) {
        userDataArr[captainIndex] = {
          ...userDataArr[captainIndex],
          ...dataCaptainFalse,
        };
        userDataArr[oldViceCaptainIndex] = {
          ...userDataArr[oldViceCaptainIndex],
          ...dataCaptainTrue,
        };
      }
    }
    updateUserData(userDataArr);
  }



  function renderRemovePlayerPopup() {
    return (
      <>
        <div className="transfer__popup">
          <button onClick={()=>addPlayer(player)}>Add Player</button>
          <button onClick={handleTransferOutClick}>Transfer out</button>
          <button onClick={handleSubsClick}>Substitute</button>
          <button onClick={() => handleCaptainData(player)}>
            Make Captain
          </button>
          <button onClick={() => handleViceCaptainData(player)}>
            Make Vice Captain
          </button>
          <button onClick={() => setRemovePlayerPopupVisibility(false)}>
            X
          </button>
        </div>
      </>
    );
  }

  function renderRestorePlayerPopup() {
    return (
      <>
        <div className="transfer__popup">
          <button onClick={restorePlayer}>Restore</button>
          <button onClick={handleSelectReplacement}>Select Replacement</button>
          <button onClick={() => setRestorePlayerPopupVisibility(false)}>
            X
          </button>
        </div>
      </>
    );
  }

  function removeButtons() {
    setShowButtons(false);
  }

  function addButtons() {
    setShowButtons(true);
  }

  function removePlayer() {
    setShowPlayer(false);
    removeButtons();
    updateUserBank(player.data.now_cost);
    // if (player.data.id === captainId) {

    // }
  }

  function handleSelectReplacement() {
    updateSelectedPosition(player.position);
    setRestorePlayerPopupVisibility(false);
  }

  function restorePlayer() {
    setShowPlayer(true);
    addButtons();
    restoreUserBank(player.data.now_cost);
    handleRestoreData(userData, player);
  }

  return (
    <div className="player">
      {removePlayerPopupVisibility ? renderRemovePlayerPopup() : null}
      {showPlayer ? (
        <>
          <div className="img__wrapper">
            <img
              onClick={() => setRemovePlayerPopupVisibility(true)}
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
            {renderNextFixture(player)}
          </div>
        </>
      ) : (
        <div className="player">
          {restorePlayerPopupVisibility ? renderRestorePlayerPopup() : null}
          <img
            onClick={() => setRestorePlayerPopupVisibility(true)}
            className="player__img"
            src="+.webp"
            alt=""
          />
        </div>
      )}
    </div>
  );
}

export default Player;
