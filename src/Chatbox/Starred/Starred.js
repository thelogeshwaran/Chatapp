import React, { useState, useEffect } from "react";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import "./Starred.css";
import { usePopupProvider } from "../../Context/PopupProvider";
import { useMessagesProvider } from "../../Context/MessagesProvider";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useAuthProvider } from "../../Context/AuthProvider";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { db } from "../../Components/Firestore/firebase";
import { useParams } from "react-router-dom";

function Starred() {
  const [data, setData] = useState([]);
  const { setRightPopup } = usePopupProvider();
  const { messages } = useMessagesProvider();
  const [anchor, setAnchor] = useState(null);
  const { user } = useAuthProvider();
  const { roomId } = useParams();
  const [messageId, setMessageId] = useState("");

  useEffect(() => {
    setData(messages.filter((item) => item.data.starred));
  }, [messages]);

  const handleDeleteMessage = () => {
    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .doc(messageId)
      .delete();
  };

  const handleStar = () => {
    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .doc(messageId)
      .update({
        starred: false,
      });
  };

  const handleExpand = (event) => {
    setAnchor(event.currentTarget);
  };
  const handleExpandClose = () => {
    setAnchor(null);
  };

  return (
    <div className="starred">
      <div className="starred__header">
        <KeyboardBackspaceIcon
          onClick={() => setRightPopup("")}
          style={{ cursor: "pointer" }}
        />
        <h3>Starred Messages</h3>
      </div>
      <div className="starred__body">
        {data &&
          data.map((item) => {
            if (item.data.message.type === "text") {
              return (
                <div
                  className={`chat__message ${
                    item.data.userId === user.uid && "chat__receiver"
                  }`}
                >
                  <div className="chat__messageheader">
                    <div className="chat__name">{item.data.name}</div>
                    <ExpandMoreIcon
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={(e) => {
                        handleExpand(e);
                        setMessageId(item.id);
                      }}
                      style={{ cursor: "pointer", marginLeft: "15%" }}
                    />
                    <Menu
                      id="simple-menu"
                      anchorEl={anchor}
                      keepMounted
                      open={Boolean(anchor)}
                      onClose={handleExpandClose}
                    >
                      <MenuItem
                        onClick={() => {
                          handleExpandClose();
                          handleStar(item.id);
                        }}
                      >
                        Unstar Message
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleExpandClose();
                          handleDeleteMessage(item.id);
                        }}
                      >
                        Delete Message
                      </MenuItem>
                    </Menu>
                  </div>

                  <div className="chat__messagedata">
                    {item.data.message.message}
                  </div>
                  <div className="chat__timestamp">
                    {new Date(
                      item.data.timeStamp?.toDate()
                    ).toLocaleTimeString()}
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  className={`chat__imagecontainer ${
                    item.data.userId === user.uid && "chat__receiver"
                  }`}
                >
                  <div className="chat__expandicon">
                    <ExpandMoreIcon
                      aria-controls="simple-menu"
                      aria-haspopup="true"
                      onClick={(e) => {
                        handleExpand(e);
                        setMessageId(item.id);
                      }}
                      style={{ cursor: "pointer", marginLeft: "15%" }}
                    />
                    <Menu
                      id="simple-menu"
                      anchorEl={anchor}
                      keepMounted
                      open={Boolean(anchor)}
                      onClose={handleExpandClose}
                    >
                      <MenuItem
                        onClick={() => {
                          handleExpandClose();
                          handleStar(item.id);
                        }}
                      >
                        Unstar Message
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleExpandClose();
                          handleDeleteMessage(item.id);
                        }}
                      >
                        Delete Message
                      </MenuItem>
                    </Menu>
                  </div>
                  <div className="chat__image">
                    <img src={item.data.message.message} alt="Starred"></img>
                  </div>
                </div>
              );
            }
          })}
      </div>
    </div>
  );
}

export default Starred;
