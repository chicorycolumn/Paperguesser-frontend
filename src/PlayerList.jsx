import React, { useState } from "react";

import s from "./css/Simple.module.css";
import g from "./css/Generic.module.css";
import a from "./css/Animations.module.css";
import panelStyles from "./css/Panel.module.css";
import styles from "./css/PlayerList.module.css";
import roomStyles from "./css/Room.module.css";

const utils = require("./utils/utils.js");

export default function PlayerList(props) {
  console.log("((PlayerList))");

  const [bootTabPlayerName, setBootTabPlayerName] = useState();

  return (
    <div
      id={`${roomStyles.playerList}`}
      className={`${panelStyles.smallPortraitPanel} ${s.overflowHidden} ${s.flexCol}`}
    >
      <h2 className={`${roomStyles.roomHeaders}`}>Players</h2>
      <div className={`${styles.innerBox01} ${s.overflowScroll}`}>
        {props.playerList &&
          props.playerList.map((roomPlayer) => {
            return (
              <div
                onClick={(e) => {
                  if (!props.playerData.isRoomboss || roomPlayer.isRoomboss) {
                    return;
                  }
                  console.log({ bootTabPlayerName });
                  if (bootTabPlayerName !== roomPlayer.playerName) {
                    setBootTabPlayerName(roomPlayer.playerName);
                    setTimeout(() => {
                      setBootTabPlayerName(null);
                    }, 2000);
                  } else {
                    setBootTabPlayerName(null);
                  }
                }}
                className={`${styles.nameItem} ${s.noSelect}`}
              >
                {bootTabPlayerName === roomPlayer.playerName ? (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (!props.playerData.isRoomboss) {
                        return;
                      }
                      props.socket.emit("Boot player", {
                        playerName: roomPlayer.playerName,
                        roomName: props.roomData.roomName,
                      });

                      props.socket.emit("Update room password", {
                        roomName: props.successfullyEnteredRoomName,
                      });
                    }}
                    className={`${styles.bootTab}`}
                  >{`Boot?`}</button>
                ) : (
                  ""
                )}
                <span className={`${styles.awards} ${styles.smallEmoji1}`}>
                  {roomPlayer.isRoomboss ? " 🎩" : ""}
                </span>

                <div
                  className={`${styles.name} ${s.overflowSplit} ${
                    roomPlayer.playerName.length > 10 ? g.nameSmaller : ""
                  }`}
                >
                  <span>{roomPlayer.playerName}</span>
                </div>

                <div className={`${styles.stars}`}>
                  <span>{`${roomPlayer.stars.toString()}`}</span>
                  <span className={`${styles.smallEmoji2}`}>⭐</span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
