import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import "./SidebarChat.css";
import { Link } from "react-router-dom";
import { db } from "../../Components/Firestore/firebase";
import CameraAltIcon from "@material-ui/icons/CameraAlt";

function SidebarChat({ room }) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    db.collection("rooms")
      .doc(room.id)
      .collection("messages")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snap) => {
        let document = snap.docs.map((doc) => doc.data());
        setMessages(document);
      });
  }, []);

  return (
    <Link to={`/rooms/${room.id}`} className="link">
      <div className="sidebarChat">
        <div className="sidebarChat__message">
          <Avatar src={room.data.url} />
          <div className="sidebarChat__info">
            <h2>{room.data.name}</h2>
            <p>
              {messages[0] ? (
                messages[0]?.message?.type === "text" ? (
                  messages[0]?.message.message.substring(0, 15) + "..."
                ) : (
                  <CameraAltIcon style={{ color: "grey" }} />
                )
              ) : (
                ""
              )}
            </p>
          </div>
        </div>
        <div className="sidebarChat__time">
          {messages[0]
            ? new Date(messages[0]?.timeStamp?.toDate()).toLocaleTimeString()
            : ""}
        </div>
      </div>
    </Link>
  );
}

export default SidebarChat;
