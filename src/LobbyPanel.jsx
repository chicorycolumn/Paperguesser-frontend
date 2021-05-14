import React, { useEffect, useState } from "react";
import $ from "jquery";

import s from "./css/Simple.module.css";
import g from "./css/Generic.module.css";
import a from "./css/Animations.module.css";
import panelStyles from "./css/Panel.module.css";

const utils = require("./utils/utils.js");

export default function LobbyPanel(props) {
  const [playerNameInput, setPlayerNameInput] = useState(
    props.playerData.playerName
  );

  useEffect(() => {
    $("#roomNameInput_LobbyPanel").select();

    utils.display.splash(a, "#enterButton_LobbyPanel");

    if (props.playerData.playerName) {
      setPlayerNameInput(props.playerData.playerName);
    }

    utils.display.addListenerForKeydownEnterToSend(
      "Lobby",
      document,
      "#enterButton_LobbyPanel",
      "#LobbyPanel"
    );

    return function cleanup() {
      $(document).off("keydown.Lobby");
    };
  }, [props.playerData]);

  console.log("((LobbyPanel))");
  return (
    <div
      tabIndex="0"
      id="LobbyPanel"
      className={`${g.boxStyle1} ${panelStyles.bigPortraitPanel} ${panelStyles.panelYellowFancy} ${s.noOutline}`}
    >
      <div className={`${panelStyles.innerBox1}`}>
        <h2>Your name</h2>
        <textarea
          onClick={(e) => {
            utils.display.selectText(document, "playerNameInput_LobbyPanel");
          }}
          id="playerNameInput_LobbyPanel"
          value={playerNameInput}
          className={`${panelStyles.entryInput}`}
          maxLength={12}
          onChange={(e) => {
            setPlayerNameInput(utils.browser.alphanumerise(e.target.value));
          }}
        ></textarea>
      </div>

      <div className={`${panelStyles.innerBox1}`}>
        <h2
          className={`${s.noSelect} ${panelStyles.title1}`}
          onClick={() => {
            props.setRoomNameInput(utils.room.createRoomName());
          }}
        >
          Create room
        </h2>
        <textarea
          onClick={(e) => {
            utils.display.selectText(document, "roomNameInput_LobbyPanel");
          }}
          onDoubleClick={(e) => {
            e.preventDefault();
            if (props.roomNameInput === "ved") {
              console.log("Enabling dev buttons");
              props.setShowDevButtons(true);
            }
          }}
          id="roomNameInput_LobbyPanel"
          value={props.roomNameInput}
          className={`${panelStyles.entryInput}`}
          maxLength={12}
          onChange={(e) => {
            props.setRoomNameInput(utils.browser.alphanumerise(e.target.value));
          }}
        ></textarea>
      </div>

      <div className={`${panelStyles.innerBox1}`}>
        <button
          id="enterButton_LobbyPanel"
          disabled={
            $("#connectErrorAlert").length ||
            !props.playerData.playerName ||
            !props.roomNameInput
          }
          className={`${g.button1} ${panelStyles.button1}`}
          onClick={(e) => {
            e.preventDefault();

            console.log("N17", {
              playerNameInput,
              roomNameInput: props.roomNameInput,
            });

            if (playerNameInput !== props.playerData.playerName) {
              console.log(
                `Hey! € Update player data with playerName:${playerNameInput}.`
              );
              props.socket.emit("Update player data", {
                player: { playerName: playerNameInput },
              });
            }

            props.socket.emit("Create room", {
              roomName: props.roomNameInput,
            });
          }}
        >
          {$("#connectErrorAlert").length ? "Waiting for server..." : "GO"}
        </button>
      </div>
    </div>
  );
}
