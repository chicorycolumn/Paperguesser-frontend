import React, { useEffect, useState } from "react";
import { navigate } from "@reach/router";
import $ from "jquery";

import s from "./css/Simple.module.css";
import g from "./css/Generic.module.css";
import a from "./css/Animations.module.css";
import styles from "./css/Room.module.css";
import panelStyles from "./css/Panel.module.css";

import DoorPanel from "./DoorPanel";
import Room from "./Room";
import InviteNavpanel from "./InviteNavpanel.jsx";

const utils = require("./utils/utils.js");

export default function RoomWrapper(props) {
  console.log("((RoomWrapper))");
  const [roomData, setRoomData] = useState();

  useEffect(() => {
    console.log(`~~RoomWrapper~~ props.socketNudge:${props.socketNudge}`);

    if (props.successfullyEnteredRoomName) {
      setTimeout(() => {
        $("#transitionObscurusImage").addClass(`${a.fadeOutFast}`);
        $("#transitionObscurusImage").removeClass(`${a.fadeInFast}`);
        $("#transitionObscurus").removeClass(`${a.fadeIn}`);
        $("#transitionObscurus").addClass(`${a.fadeOut}`);
      }, 400);
    }

    if (props.socket && props.socketNudge) {
      if (!props.playerData.playerName) {
        props.socket.emit("Update player data", {
          player: {
            playerName: props.socket.id.slice(0, 3),
          },
        });
      }

      if (!roomData) {
        props.socket.emit("Request room data", {
          roomName: props.successfullyEnteredRoomName,
        });

        if (props.playerData.isRoomboss) {
          setTimeout(() => {
            props.setShowInviteNavpanel(true);
          }, 800);
        } else {
          setTimeout(() => {
            $("#Invite_Navbar").addClass(`${a.flashPink}`);
            setTimeout(() => {
              $("#Invite_Navbar").removeClass(`${a.flashPink}`);
            }, 5000);
          }, 1000);
        }
      }

      props.socket.on("Room data", function (data) {
        setRoomData(data.room);
      });

      props.socket.on("Room password updated", function (data) {
        if (data.roomName !== props.successfullyEnteredRoomName) {
          console.log(
            `D55 Why do these roomNames not match? data.roomName:"${data.roomName}", props.successfullyEnteredRoomName:"${props.successfullyEnteredRoomName}".`
          );
          return;
        }

        console.log("Setting cookie:", `${data.roomPassword}-${data.roomName}`);
        utils.browser.setCookie(
          "roomPassword",
          `${data.roomPassword}-${data.roomName}`
        );
      });

      props.socket.on("Player entered your room", function (data) {
        setRoomData(data.room);
      });

      props.socket.on("Player left your room", function (data) {
        console.log("Ø Player left your room");
        setRoomData(data.room);
      });

      props.socket.on("You're booted", function (data) {
        console.log(`Ø You're booted from ${data.roomName}.`);

        console.log(`data.roomName:${data.roomName}`);
        console.log(
          `props.successfullyEnteredRoomName:${props.successfullyEnteredRoomName}`
        );

        if (props.successfullyEnteredRoomName !== data.roomName) {
          console.log(
            `N49 The server wants to boot me from room ${data.roomName} but I'm not in that room, I think?`
          );
        }

        navigate("/");
        props.setSuccessfullyEnteredRoomName(null);
        props.setShowAlert(data.msg);
        props.socket.emit("I was booted", data);
      });
    }

    return function cleanup() {
      console.log("##RoomWrapper##");

      if (props.socket) {
        props.socket.off("Room data");
        props.socket.off("Room password updated");
        props.socket.off("Player entered your room");
        props.socket.off("Player left your room");
        props.socket.off("You're booted");
      }
    };
  }, [props.successfullyEnteredRoomName]);

  return roomData ? (
    <>
      {props.showInviteNavpanel && (
        <div className={`${g.obscurus} ${a.fadeIn}`}>
          <InviteNavpanel
            socket={props.socket}
            playerData={props.playerData}
            roomData={roomData}
            setShowInviteNavpanel={props.setShowInviteNavpanel}
            successfullyEnteredRoomName={props.successfullyEnteredRoomName}
          />
        </div>
      )}
      <Room
        socket={props.socket}
        playerData={props.playerData}
        roomData={roomData}
        setRoomData={setRoomData}
        successfullyEnteredRoomName={props.successfullyEnteredRoomName}
        setSuccessfullyEnteredRoomName={props.setSuccessfullyEnteredRoomName}
      />
    </>
  ) : (
    <DoorPanel socket={props.socket} playerData={props.playerData} />
  );
}
