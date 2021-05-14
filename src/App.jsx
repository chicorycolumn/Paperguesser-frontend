import React, { useEffect, useState } from "react";
import { Router, navigate } from "@reach/router";
import socketIOClient from "socket.io-client";
import $ from "jquery";

import s from "./css/Simple.module.css";
import g from "./css/Generic.module.css";
import a from "./css/Animations.module.css";
import panelStyles from "./css/Panel.module.css";
import styles from "./css/App.module.css";

import logoCentred from "./images/logo_cat_centred.png";

import LobbyPanel from "./LobbyPanel.jsx";
import RoomWrapper from "./RoomWrapper.jsx";
import Navbar from "./Navbar.jsx";
import OptionsNavpanel from "./OptionsNavpanel.jsx";
import Alert from "./Alert.jsx";

const utils = require("./utils/utils.js");

const localEnv = false;
const ENDPOINT = localEnv
  ? "http://127.0.0.1:4002"
  : "https://chattercat-server.herokuapp.com/";

export default function App() {
  console.log("((App))");

  const [roomNameInput, setRoomNameInput] = useState("");
  const [playerData, setPlayerData] = useState({});
  console.log("((So playerData is)))", playerData);
  const [successfullyEnteredRoomName, setSuccessfullyEnteredRoomName] =
    useState(null);
  const [socket, setSocket] = useState(null);
  const [socketNudge, setSocketNudge] = useState();
  const [showInviteNavpanel, setShowInviteNavpanel] = useState();
  const [showOptionsNavpanel, setShowOptionsNavpanel] = useState();
  const [showAlert, setShowAlert] = useState();
  const [connectErrorAlert, setConnectErrorAlert] = useState();
  const [showDevButtons, setShowDevButtons] = useState(false);

  // const refContainer = useRef(null);

  useEffect(() => {
    let socket = socketIOClient(ENDPOINT);
    // refContainer.current = socket;
    setSocket(socket);

    console.log(`~~App~~ socket.id:${socket.id}`);

    socket.on("connect", (data) => {
      setConnectErrorAlert(null);

      socket.emit("Load player", {
        truePlayerName: utils.browser.getCookie("truePlayerName"),
        playerName: utils.browser.getCookie("playerName"),
      });

      setSocketNudge(true);

      console.log(
        `Ø connect. I am ${socket.id.slice(
          0,
          5
        )} and I connected to server at ${new Date()
          .toUTCString()
          .slice(17, -4)}.`
      );
    });

    socket.on("Player loaded", function (data) {
      setPlayerData(data.player);

      if (data.msg) {
        setShowAlert(data.msg);
      }

      if (!data.player.playerName) {
        socket.emit("Update player data", {
          player: {
            playerName: socket.id.slice(0, 3),
          },
        });
      }

      utils.browser.setCookie("playerName", data.player.playerName);
      utils.browser.setCookie("truePlayerName", data.player.truePlayerName);
    });

    socket.on("Entry granted", function (data) {
      if (data.roomPassword) {
        console.log(
          "Setting cookie:",
          `${data.roomPassword}-${successfullyEnteredRoomName}`
        );
        utils.browser.setCookie(
          "roomPassword",
          `${data.roomPassword}-${successfullyEnteredRoomName}`
        );
      }

      console.log("Ø Entry granted");
      $("#transitionObscurusImage").removeClass(`${a.fadeOutFast}`);
      $("#transitionObscurusImage").addClass(`${a.fadeInFast}`);
      $("#transitionObscurus").removeClass(`${a.fadeOut}`);
      $("#transitionObscurus").addClass(`${a.fadeIn}`);

      setTimeout(() => {
        setPlayerData(data.player);
        setSuccessfullyEnteredRoomName(data.room.roomName);
        navigate(`/${data.room.roomName}`);
      }, 200);
    });

    socket.on("Room not created or found", function (data) {
      navigate("/");
      setShowAlert(data.msg);
    });

    socket.on("Dev queried", function (data) {
      console.log(data);
    });

    socket.on("Entry denied", function (data) {
      setShowAlert(data.msg);
    });

    socket.on("connect_error", function () {
      setConnectErrorAlert(true);
    });

    socket.on("You should refresh", function (data) {
      window.location.reload();
    });

    socket.on("disconnect", (data) => {
      setSuccessfullyEnteredRoomName(null);
      console.log(
        `Ø disconnect. I disconnected from server at ${new Date()
          .toUTCString()
          .slice(17, -4)}.`
      );
      navigate("/");
      setShowAlert({ text: "Your connection was reset.", emotion: "sad" });
      setTimeout(() => {
        setShowAlert(null);
      }, 2500);
    });

    return function cleanup() {
      console.log("##App##");
      setSuccessfullyEnteredRoomName(null);
      socket.disconnect();
    };
  }, []);

  console.log(`pre-R ${Object.keys(playerData).length}`, playerData);

  return (
    <div className={`${styles.App}`}>
      <header></header>
      <div id="background" className={styles.background}></div>
      <div id="backgroundShroud" className={`${styles.backgroundShroud}`}></div>
      <div id="transitionObscurus" className={`${g.transitionObscurus}`}>
        <div id="transitionObscurusImage">
          <img
            alt="logo"
            className={`${a.spin} ${g.transitionObscurusImage}`}
            src={logoCentred}
          />
        </div>
      </div>

      <Navbar
        socket={socket}
        setShowInviteNavpanel={setShowInviteNavpanel}
        showInviteNavpanel={showInviteNavpanel}
        setShowOptionsNavpanel={setShowOptionsNavpanel}
        showOptionsNavpanel={showOptionsNavpanel}
        successfullyEnteredRoomName={successfullyEnteredRoomName}
        showDevButtons={showDevButtons}
        connectErrorAlert={connectErrorAlert}
      />
      {showOptionsNavpanel && (
        <div className={`${g.obscurus} ${a.fadeIn}`}>
          <OptionsNavpanel
            socket={socket}
            playerData={playerData}
            setShowOptionsNavpanel={setShowOptionsNavpanel}
            successfullyEnteredRoomName={successfullyEnteredRoomName}
          />
        </div>
      )}
      {showAlert && (
        <div className={`${g.obscurus} ${a.fadeIn}`}>
          <Alert showAlert={showAlert} setShowAlert={setShowAlert} />
        </div>
      )}
      <Router>
        <LobbyPanel
          path="/"
          socket={socket}
          roomNameInput={roomNameInput}
          setRoomNameInput={setRoomNameInput}
          playerData={playerData}
          setShowDevButtons={setShowDevButtons}
        />
        <RoomWrapper
          path="/*"
          socket={socket}
          socketNudge={socketNudge}
          successfullyEnteredRoomName={successfullyEnteredRoomName}
          setSuccessfullyEnteredRoomName={setSuccessfullyEnteredRoomName}
          playerData={playerData}
          setShowAlert={setShowAlert}
          showInviteNavpanel={showInviteNavpanel}
          setShowInviteNavpanel={setShowInviteNavpanel}
        />
      </Router>
    </div>
  );
}
