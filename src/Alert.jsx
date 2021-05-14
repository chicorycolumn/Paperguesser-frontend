import React, { useEffect } from "react";
import $ from "jquery";

import s from "./css/Simple.module.css";
import g from "./css/Generic.module.css";
import a from "./css/Animations.module.css";
import panelStyles from "./css/Panel.module.css";
import styles from "./css/Alert.module.css";

import sadImage from "./images/witchcat_sad_exclam.png";
import happyImage from "./images/witchcat_happy.png";

const utils = require("./utils/utils.js");

export default function Alert(props) {
  console.log("((Alert))");

  useEffect(() => {
    $(document).on("keydown.Alert", (e) => {
      utils.display.keydownToClose(e, props.setShowAlert, "Alert");
    });

    $(document).on("click.Alert", () => {
      utils.display.clickOutsideToClose("#Alert", props.setShowAlert);
    });

    return function cleanup() {
      $(document).off("keydown.Alert");
      $(document).off("click.Alert");
    };
  }, []);

  return (
    <>
      {props.showAlert.emotion === "sad" && (
        <div
          tabIndex="0"
          id="Alert"
          className={`${g.boxStyle1} ${panelStyles.smallLandscapePanel} ${panelStyles.panelPink1} ${s.noOutline} ${s.posRel}`}
        >
          <img
            alt="sad face"
            src={sadImage}
            className={`${styles.backgroundImageLeft}`}
          />
          <button
            onClick={(e) => {
              props.setShowAlert(false);
            }}
            className={`${panelStyles.exitButton} ${panelStyles.exitButtonPink}`}
          >
            &times;
          </button>
          <p className={`${styles.alertText}`}> {props.showAlert.text}</p>
        </div>
      )}

      {props.showAlert.emotion === "happy" && (
        <div
          tabIndex="0"
          id="Alert"
          className={`${g.boxStyle1} ${panelStyles.smallLandscapePanel} ${panelStyles.panelYellow1} ${s.noOutline} ${s.posRel}`}
        >
          <img
            alt="happy face"
            src={happyImage}
            className={`${styles.backgroundImageRight}`}
          />
          <button
            onClick={(e) => {
              props.setShowAlert(false);
            }}
            className={`${panelStyles.exitButton} ${panelStyles.exitButtonYellow}`}
          >
            &times;
          </button>
          <p className={`${styles.alertText}`}> {props.showAlert.text}</p>
        </div>
      )}
    </>
  );
}
