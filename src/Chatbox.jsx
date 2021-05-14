import React, { useEffect, useState } from "react";
import $ from "jquery";

import s from "./css/Simple.module.css";
import g from "./css/Generic.module.css";
import a from "./css/Animations.module.css";
import panelStyles from "./css/Panel.module.css";
import styles from "./css/Chatbox.module.css";
import roomStyles from "./css/Room.module.css";

const utils = require("./utils/utils.js");

export default function Chatbox(props) {
  console.log("((Chatbox))");

  let [chatArray, setChatArray] = useState([]);
  let [chatMsg, setChatMsg] = useState("");

  useEffect(() => {
    console.log("~~Chatbox~~");

    utils.display.addListenerForKeydownEnterToSend(
      "Chatbox",
      "#chatboxInput_Chatbox",
      "#chatboxSendButton_Chatbox"
    );

    function SH_playerEntered(data) {
      addToChatArray(`${data.player.playerName} entered`);
    }
    function SH_playerLeft(data) {
      if (data.isBoot) {
        addToChatArray(
          `${data.player.playerName} was booted`,
          `The password has changed`
        );
      } else {
        addToChatArray(`${data.player.playerName} has left`);
      }
    }

    if (props.socket) {
      props.socket.on("Player entered your room", SH_playerEntered);
      props.socket.on("Player left your room", SH_playerLeft);
      props.socket.on("Chat message", function (data) {
        if (data.sender) {
          addToChatArray([data.sender.playerName, data.chatMsg]);
        } else {
          addToChatArray(data.chatMsg);
        }
      });
    }
    function addToChatArray(...chatItems) {
      let newChatArray = chatArray.slice(chatArray.length - 50);

      chatItems.forEach((chatItem) => {
        newChatArray.push(chatItem);
      });

      setChatArray(newChatArray);
      utils.display.updateScroll("chatOutputContainer");
    }
    return function cleanup() {
      console.log("##Chatbox##");
      props.socket.off("Player entered your room", SH_playerEntered);
      props.socket.off("Player left your room", SH_playerLeft);
      props.socket.off("Chat message");
      $("#chatboxInput_Chatbox").off("keydown.Chatbox");
    };
  }, [props.socket, chatArray]);

  function sendChat() {
    if (!chatMsg) {
      console.log("No chat message");
      return;
    }

    if (chatMsg.slice(0, 5).toLowerCase() === "star ") {
      let playerNameToStar = chatMsg.split(" ")[1];
      if (
        props.playerList.find(
          (player) => player.playerName === playerNameToStar
        )
      ) {
        props.socket.emit("Give stars", {
          playerNameToStar,
          starIncrement: 1,
        });
        setChatMsg("");
        return;
      }
    }

    console.log("€ Chat message", chatMsg);
    props.socket.emit("Chat message", { chatMsg: chatMsg });
    setChatMsg("");
  }

  return (
    <div className={`${g.boxStyle1} ${styles.chatboxSuper}`}>
      <h2 className={`${roomStyles.roomHeaders}`}>
        {props.playerData.playerName}'s chatbox
      </h2>
      <div
        id="chatOutputContainer"
        className={`${s.overflowScroll} ${styles.chatOutputContainer}`}
      >
        {chatArray.map((chatItem) => {
          let chatName = chatItem[0];
          let chatDialogue = chatItem[1];

          return typeof chatItem === "string" ? (
            <div className={`${styles.chatItem}`}>
              <p className={`${styles.chatAnnouncement}`}>{chatItem}</p>
            </div>
          ) : (
            <div className={`${styles.chatItem}`}>
              <p
                className={`${styles.chatName}
              ${s.overflowSplit} ${chatName.length > 10 ? g.nameSmaller : ""}
              `}
              >
                {chatName}
              </p>
              <p className={`${styles.chatDialogue} ${s.overflowSplit}`}>
                {chatDialogue}
              </p>
            </div>
          );
        })}
      </div>
      <form className={`${styles.chatInputContainer}`}>
        <textarea
          id="chatboxInput_Chatbox"
          className={`${styles.chatboxInput}`}
          value={chatMsg}
          maxLength="50"
          type="text"
          onChange={(e) => {
            setChatMsg(e.target.value);
          }}
        ></textarea>
        <button
          disabled={!chatMsg.length}
          id="chatboxSendButton_Chatbox"
          className={`${styles.sendButton}`}
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            sendChat();
          }}
        >
          SEND
        </button>
      </form>
    </div>
  );
}
