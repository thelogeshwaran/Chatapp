import React, { useState } from "react";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { usePopupProvider } from "../../Context/PopupProvider";
import "./NewChat.css";
import SearchIcon from "@material-ui/icons/Search";
import { IconButton } from "@material-ui/core";
import { db } from "../../Components/Firestore/firebase";
import firebase from "firebase";
import ClearIcon from "@material-ui/icons/Clear";

function NewChat() {
  const { setLeftPopup } = usePopupProvider();
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomName) {
      db.collection("rooms").add({
        name: roomName[0].toUpperCase() + roomName.slice(1),
        description: "",
        url: "",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    setRoomName("");
    setLeftPopup(false);
  };

  return (
    <div className="newchat">
      <div className="newchat__header">
        <KeyboardBackspaceIcon
          onClick={() => setLeftPopup("")}
          style={{ cursor: "pointer" }}
        />
        <h2>New Chat</h2>
      </div>
      <div className="newchat__searchbar">
        <div className="search_container">
          {roomName ? (
            <IconButton>
              <ClearIcon onClick={() => setRoomName("")} />
            </IconButton>
          ) : (
            <IconButton>
              <SearchIcon />
            </IconButton>
          )}
          <form onSubmit={(e) => handleSubmit(e)} className="search__input">
            <input
              type="text"
              autoFocus
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter a RoomName"
            />
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewChat;
