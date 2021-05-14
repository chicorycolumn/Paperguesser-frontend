import React, { useEffect, useState } from "react";
import { useLocation } from "@reach/router";
import $ from "jquery";

import s from "./css/Simple.module.css";
import g from "./css/Generic.module.css";
import a from "./css/Animations.module.css";
import panelStyles from "./css/Panel.module.css";

const utils = require("./utils/utils.js");

export default function DoorPanel(props) {
  console.log("((DoorPanel))");
  const [playerNameInput, setPlayerNameInput] = useState(
    props.playerData.playerName
  );

  let rpw = utils.browser.getCookie("roomPassword");

  const [roomPasswordInput, setRoomPasswordInput] = useState(
    rpw ? rpw.split("-")[0] : ""
  );

  const location = useLocation();

  useEffect(() => {
    utils.display.splash(a, "#enterButton_DoorPanel", 2, 1);

    if (props.socket) {
      console.log("€ Query room password protection");
      props.socket.emit("Query room password protection", {
        roomName: location.pathname.slice(1),
      });

      props.socket.on("Queried room password protection", function (data) {
        console.log("Ø Queried room password protection", data);

        if (data.roomName !== location.pathname.slice(1)) {
          console.log(
            `But the roomNames don't match? We received password status for ${
              data.roomName
            } but we're at ${location.pathname.slice(1)}.`
          );
          return;
        }

        if (data.isPasswordProtected) {
          setTimeout(() => {
            $("#passwordOverbox").removeClass(s.opacity5);
            $("#roomPasswordInput_DoorPanel").prop("disabled", false);
            $("#roomPasswordInput_DoorPanel").removeClass(
              panelStyles.entryInputNoHover
            );
            $("#roomPasswordInput_DoorPanel").addClass(panelStyles.entryInput);

            $("#roomPasswordInput_DoorPanel").select();
          }, 100);
        } else {
          $("#roomPasswordInput_DoorPanel").select(false);
          $("#passwordOverbox").addClass(s.opacity5);
          $("#roomPasswordInput_DoorPanel").prop("disabled", true);
          $("#roomPasswordInput_DoorPanel").addClass(
            panelStyles.entryInputNoHover
          );
          $("#roomPasswordInput_DoorPanel").removeClass(panelStyles.entryInput);
        }
      });
    }

    if (props.playerData.playerName) {
      setPlayerNameInput(props.playerData.playerName);
    }

    $("#DoorPanel").focus();

    utils.display.addListenerForKeydownEnterToSend(
      "Door",
      document,
      "#enterButton_DoorPanel",
      "#DoorPanel"
    );

    return function cleanup() {
      $(document).off("keydown.Door");
      if (props.socket) {
        props.socket.emit("Query room password protection", {
          roomName: location.pathname.slice(1),
          amLeaving: true,
        });
        props.socket.off("Queried room password protection");
      }
    };
  }, [props.playerData]);

  return (
    <div
      tabIndex="0"
      id="DoorPanel"
      className={`${g.boxStyle1} ${panelStyles.bigPortraitPanel} ${panelStyles.panelPinkFancy} ${s.noOutline}`}
    >
      <div className={`${panelStyles.innerBox1}`}>
        <h2 className={`${s.noSelect} ${panelStyles.title1}`}>Your name</h2>
        <textarea
          onClick={(e) => {
            utils.display.selectText(document, "playerNameInput_DoorPanel");
          }}
          id="playerNameInput_DoorPanel"
          value={playerNameInput}
          className={`${panelStyles.entryInput}`}
          maxLength={12}
          onChange={(e) => {
            setPlayerNameInput(utils.browser.alphanumerise(e.target.value));
            console.log(
              `playerNameInput_DoorPanel. playerNameInput:${playerNameInput}.`
            );
          }}
        ></textarea>
      </div>
      <div id="passwordOverbox" className={`${panelStyles.innerBox1}`}>
        <h2 className={`${s.noSelect} ${panelStyles.title1}`}>Room password</h2>
        <textarea
          onClick={(e) => {
            utils.display.selectText(document, "roomPasswordInput_DoorPanel");
          }}
          id="roomPasswordInput_DoorPanel"
          value={roomPasswordInput}
          className={`${panelStyles.entryInput} ${panelStyles.entryInputNoHover}`}
          maxLength={4}
          onChange={(e) => {
            setRoomPasswordInput(
              utils.browser.alphanumerise(e.target.value).toUpperCase()
            );
            console.log(
              `roomPasswordInput_DoorPanel. roomPasswordInput:${roomPasswordInput}.`
            );
          }}
        ></textarea>
      </div>

      <div className={`${panelStyles.innerBox1}`}>
        <button
          id="enterButton_DoorPanel"
          disabled={$("#connectErrorAlert").length || !playerNameInput}
          className={`${g.button1} ${panelStyles.button1}`}
          onClick={(e) => {
            e.preventDefault();

            if (playerNameInput !== props.playerData.playerName) {
              console.log(
                `€ Update player data. playerNameInput:${playerNameInput}.`
              );
              props.socket.emit("Update player data", {
                player: {
                  playerName: playerNameInput,
                },
              });
            }

            let roomName = location.pathname.slice(1);

            console.log("Setting cookie:", `${roomPasswordInput}-${roomName}`);
            utils.browser.setCookie(
              "roomPassword",
              `${roomPasswordInput}-${roomName}`
            );

            utils.room.requestEntry(
              props.socket,
              props.playerData,
              roomName,
              roomPasswordInput
            );
          }}
        >
          {$("#connectErrorAlert").length ? "Waiting for server..." : "ENTER"}
        </button>
      </div>
    </div>
  );
}
