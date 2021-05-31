import React, { useState, useEffect, useRef } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { usePopupProvider } from "../../../Context/PopupProvider";
import { useParams } from "react-router-dom";
import { useMessagesProvider } from "../../../Context/MessagesProvider";
import { useAuthProvider } from "../../../Context/AuthProvider";
import { db } from "../../Common/Firestore/firebase";
import Fade from "@material-ui/core/Fade";
import "./ChatContainer.css";
import moment from "moment";
import { toast } from "react-toastify";

function ChatContainer({ setReply }) {
  const { roomId } = useParams();
  const [anchor, setAnchor] = useState(null);
  const { setSelected } = usePopupProvider();
  const [message, setMessage] = useState("");
  const { user } = useAuthProvider();
  const messagesEndRef = useRef(null);
  const { messages } = useMessagesProvider();

  const colors = ["#233e8b", "#ff7b54", "#194350", "#7b113a"];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  function getRandomItem(arr) {
    const randomIndex = Math.floor(Math.random() * arr.length);
    const item = arr[randomIndex];
    return item;
  }
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteMessage = () => {
    if (message.data.userId === user.uid) {
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .doc(message.id)
        .delete();
    } else {
      toast.error("You Cannot delete others message");
    }
  };
  const handleStar = () => {
    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .doc(message)
      .update({
        starred: true,
      });
  };

  const handleExpand = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleExpandClose = () => {
    setAnchor(null);
  };

  return (
    <div>
      <div>
        {messages &&
          messages.map((item) => {
            return (
              <div
                className={`chat__message ${
                  item.data.userId === user.uid && "chat__receiver"
                }`}
              >
                <div className="chat__messageheader">
                  <div
                    className="chat__name"
                    style={{
                      color:
                        item.data.userId === user.uid
                          ? "#29bb89"
                          : getRandomItem(colors),
                    }}
                  >
                    {item.data.userId === user.uid ? "You" : item.data.name}
                  </div>
                  <ExpandMoreIcon
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={(e) => {
                      handleExpand(e);
                      setMessage(item);
                    }}
                    style={{ cursor: "pointer", marginLeft: "4%" }}
                  />
                  <Menu
                    id="simple-menu"
                    anchorEl={anchor}
                    keepMounted
                    open={Boolean(anchor)}
                    onClose={handleExpandClose}
                    TransitionComponent={Fade}
                  >
                    <MenuItem
                      onClick={() => {
                        handleExpandClose();
                        setReply(message);
                      }}
                    >
                      Reply
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleStar();
                        handleExpandClose();
                      }}
                    >
                      Star Message
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleExpandClose();
                        handleDeleteMessage();
                      }}
                    >
                      Delete Message
                    </MenuItem>
                  </Menu>
                </div>
                {item.data?.reply && (
                  <div
                    className="chat__reply"
                    style={{
                      borderLeft:
                        item.data.reply.userId === user.uid
                          ? "4px solid #29bb89"
                          : "4px solid #3edbf0",
                    }}
                  >
                    <div
                      className="chat__replyName"
                      style={{
                        color:
                          item.data.reply.userId === user.uid
                            ? "#29bb89"
                            : "#3edbf0",
                      }}
                    >
                      {item.data.reply.userId === user.uid
                        ? "You"
                        : item.data.reply.name}{" "}
                    </div>
                    <div className="chat__replyMessage">
                      {item.data.reply.message.type === "text"
                        ? item.data.reply.message.message
                        : "Image"}{" "}
                    </div>
                  </div>
                )}
                {item.data.message.type === "text" ? (
                  <div className="chat__messagedata">
                    {item.data.message.message}
                  </div>
                ) : (
                  <div className="chat__imagecontainer">
                    <div className="chat__image">
                      <img
                        src={item.data.message.message}
                        onClick={() => setSelected(item.data.message.message)}
                        alt="image"
                      ></img>
                    </div>
                  </div>
                )}

                <div className="chat__timestamp">
                  {moment(item.data.timeStamp?.toDate()).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}
                </div>
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default ChatContainer;
