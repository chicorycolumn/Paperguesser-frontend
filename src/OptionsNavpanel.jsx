import React, { useEffect } from "react";
import $ from "jquery";

import s from "./css/Simple.module.css";
import g from "./css/Generic.module.css";
import a from "./css/Animations.module.css";
import panelStyles from "./css/Panel.module.css";
import styles from "./css/Navpanel.module.css";

const utils = require("./utils/utils.js");

export default function OptionsNavpanel(props) {
  console.log("((OptionsNavpanel))");

  useEffect(() => {
    utils.display.splash(a, ["#buttonRestart", "#buttonContact"], 1);

    $(document).on("click.OptionsNavpanel", () => {
      utils.display.clickOutsideToClose(
        "#OptionsNavpanel",
        props.setShowOptionsNavpanel
      );
    });

    return function cleanup() {
      $(document).off("click.OptionsNavpanel");
    };
  }, []);

  return (
    <div
      tabIndex="0"
      id="OptionsNavpanel"
      className={`${a.fadeIn} ${g.boxStyle1} ${panelStyles.mediumLandscapePanel} ${panelStyles.panelBlue1} ${s.noOutline}`}
    >
      <button
        onClick={(e) => {
          props.setShowOptionsNavpanel(false);
        }}
        className={`${panelStyles.exitButton} ${panelStyles.exitButtonBlue}`}
      >
        &times;
      </button>
      {props.playerData.isRoomboss && (
        <div className={`${styles.inputContainer1}`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log("€ Wipe game stats");
              props.socket.emit("Wipe game stats", {
                roomName: props.successfullyEnteredRoomName,
              });
              setTimeout(() => {
                props.setShowOptionsNavpanel(false);
              }, 500);
            }}
            id="buttonRestart"
            className={`${panelStyles.copyButton}`}
          >
            💣
          </button>
          <p className={`${styles.optionText}`}>Restart game</p>
        </div>
      )}
      <div className={`${styles.inputContainer1}`}>
        <p className={`${styles.optionText}`}>Contact creator</p>
        <button
          onClick={(e) => {
            e.preventDefault();
            window.open("mailto:c.matus.contact@gmail.com", "_blank");
          }}
          id="buttonContact"
          className={`${panelStyles.copyButton}`}
        >
          ✉️
        </button>
      </div>
    </div>
  );
}
