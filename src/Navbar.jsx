import React from "react";
import { Link } from "@reach/router";

import s from "./css/Simple.module.css";
import g from "./css/Generic.module.css";
import a from "./css/Animations.module.css";
import styles from "./css/Navbar.module.css";

import navlogo from "./images/logo_cat.png";
import navlogoBroken from "./images/logo_cat_broken.png";

const utils = require("./utils/utils.js");

let devSwitch = false;

const Navbar = (props) => {
  return (
    <div
      id="navbar"
      className={`${styles.navbar} ${
        props.connectErrorAlert && styles.errorColor
      }`}
    >
      <Link
        className={`${styles.navbarInnerBoxLeft} ${styles.hoverable1}`}
        to="/"
      >
        {props.connectErrorAlert ? (
          <img
            alt="logo in a broken style"
            id="connectErrorAlert"
            className={`${styles.navbarLogo}`}
            src={navlogoBroken}
          />
        ) : (
          <img alt="logo" className={`${styles.navbarLogo}`} src={navlogo} />
        )}
        <h1 className={`${styles.navbarTitle}`}>Chattercat</h1>{" "}
      </Link>

      <div className={`${styles.navbarInnerBoxRight}`}>
        {props.successfullyEnteredRoomName && (
          <Link
            id="Invite_Navbar"
            className={`${styles.navbarItem} ${styles.hoverable1} ${
              props.showInviteNavpanel ? styles.hoverable1hovered : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              props.setShowInviteNavpanel(true);
            }}
            to=""
          >
            Invite
          </Link>
        )}
        <Link
          className={`${styles.navbarItem} ${styles.navbarItemSmall}  ${
            styles.hoverable1
          } ${props.showOptionsNavpanel ? styles.hoverable1hovered : ""}`}
          onClick={(e) => {
            e.preventDefault();
            props.setShowOptionsNavpanel(true);
          }}
          to=""
        >
          ⚙
        </Link>

        {props.showDevButtons && (
          <>
            <button
              className={`${g.devButton} ${styles.navbarItem} ${styles.hoverable1}`}
              onClick={(e) => {
                e.preventDefault();
                props.socket.emit("Dev query");
              }}
            >
              dQ
            </button>
            <button
              className={`${g.devButton} ${styles.navbarItem} ${styles.hoverable1}`}
              onDoubleClick={(e) => {
                e.preventDefault();
                console.log("DESTROY");
                props.socket.emit("Dev destroy all");
              }}
            >
              dD
            </button>
          </>
        )}
      </div>
      {devSwitch && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              props.socket.emit("Hello to all");
            }}
          >
            Hello to all
          </button>
        </>
      )}
    </div>
  );
};

export default Navbar;
