import React, { useEffect } from "react";

import s from "./css/Simple.module.css";
import g from "./css/Generic.module.css";
import a from "./css/Animations.module.css";
import styles from "./css/Room.module.css";

import PlayerList from "./PlayerList";
import Instructions from "./Instructions";
import Chatbox from "./Chatbox";

const utils = require("./utils/utils.js");

export default function Room(props) {
  console.log("((Room))");

  useEffect(() => {
    return function cleanup() {
      console.log("##Room## (will leave room)");
      if (props.socket) {
        props.socket.off("Player entered your room");
        props.socket.off("Player left your room");
        let rooName = props.roomData.roomName;
        props.setRoomData(null);
        props.setSuccessfullyEnteredRoomName(null);
        props.socket.emit("Leave room", {
          roomName: rooName,
        });
      }
    };
  }, []);

  return (
    <div className={`${styles.Room}`}>
      <div className={`${styles.topContainer}`}>
        <PlayerList
          playerData={props.playerData}
          roomData={props.roomData}
          playerList={props.roomData.players}
          socket={props.socket}
          successfullyEnteredRoomName={props.successfullyEnteredRoomName}
        />
        <Instructions />
      </div>
      <div className={`${styles.bottomContainer}`}>
        <Chatbox
          socket={props.socket}
          playerData={props.playerData}
          playerList={props.roomData.players}
        />
      </div>
    </div>
  );
}
