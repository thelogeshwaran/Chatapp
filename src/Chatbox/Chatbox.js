import { Avatar, IconButton } from "@material-ui/core";
import React, { useState, useEffect, useRef } from "react";
import { db } from "../Components/Firestore/firebase";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import "./Chatbox.css";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import { useParams } from "react-router-dom";
import firebase from "firebase";
import { useAuthProvider } from "../Context/AuthProvider";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import Picker from "emoji-picker-react";
import RightPopup from "../Chatbox/RightPopup/RightPopup";
import { usePopupProvider } from "../Context/PopupProvider";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { useMessagesProvider } from "../Context/MessagesProvider";
import Progressbar from "../Components/Progressbar/Progressbar";
import SendIcon from "@material-ui/icons/Send";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Fade from "@material-ui/core/Fade";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { Link } from "react-router-dom";

function Chatbox() {
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [emojiOpen, setEmojiOpen] = useState(false);
  const { user } = useAuthProvider();
  const messagesEndRef = useRef(null);
  const { setRightPopup, setSelected } = usePopupProvider();
  const {
    messages,
    room,
    setChatId,
    setUpload,
  } = useMessagesProvider();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchor, setAnchor] = useState(null);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [messageId, setMessageId] = useState("");

  useEffect(() => {
    setChatId(roomId);
  }, [roomId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onEmojiClick = (event, emojiObject) => {
    setInput(input + emojiObject.emoji);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setEmojiOpen(false);
    if (input) {
      db.collection("rooms")
        ?.doc(roomId)
        .collection("messages")
        .add({
          userId: user.uid,
          message: { type: "text", message: input },
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          name: user.displayName,
          starred: false,
        });

      db.collection("rooms").doc(roomId).update({
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    setInput("");
  };

  const handleClearMessages = () => {
    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .get()
      .then((res) => {
        res.forEach((element) => {
          element.ref.delete();
        });
      });
  };

  function inputHandler(e) {
    const image = e.target.files[0];
    const types = ["image/jpeg", "image/png"];
    if (image && types.includes(image.type)) {
      setFile(image);
      setUpload("MESSAGE");
      // setError("")
    } else {
      // setError("Please upload the image of file type png or jpeg!");
      setFile(null);
    }
  }
  const handleStar = () => {
    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .doc(messageId)
      .update({
        starred: true,
      });
  };

  const handleDeleteMessage = (id) => {
    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .doc(messageId)
      .delete();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleExpand = (event) => {
    setAnchor(event.currentTarget);
  };

  const handleExpandClose = () => {
    setAnchor(null);
  };

  console.log(messages);
  return (
    <div className="chatbox">
      <div className="chatbox__content">
        <div className="chatbox__heading">
          <div className="chatbox__backicon">
            <Link to="/">
              <IconButton>
                <ArrowBackIosIcon />
              </IconButton>
            </Link>
          </div>
          <Avatar
            src={room.url}
            onClick={() => setRightPopup("GROUPINFO")}
            style={{ cursor: "pointer" }}
          />
          <div className="chatbox__headingInfo">
            <h3>{room.name}</h3>
            <p>{room.description}</p>
          </div>
          <div className="chatbox__hedingRight">
            <IconButton>
              <SearchIcon onClick={() => setRightPopup("SEARCH")} />
            </IconButton>
            <IconButton>
              <MoreVertIcon
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
              />
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                TransitionComponent={Fade}
              >
                <MenuItem
                  onClick={() => {
                    setRightPopup("GROUPINFO");
                    handleClose();
                  }}
                >
                  Group Info
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setRightPopup("STARRED");
                    handleClose();
                  }}
                >
                  Starred Messages
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleClose();
                    handleClearMessages();
                  }}
                >
                  Clear Messages
                </MenuItem>
              </Menu>
            </IconButton>
          </div>
        </div>
        <div className="chatbox__body">
          {messages &&
            messages.map((item) => {
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
                        style={{ cursor: "pointer", marginLeft: "4%" }}
                      />
                      <Menu
                        id="simple-menu"
                        anchorEl={anchor}
                        keepMounted
                        open={Boolean(anchor)}
                        onClose={handleExpandClose}
                      >
                        {/* <MenuItem onClick={()=>{handleExpandClose()}}>Reply</MenuItem> */}
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
                        style={{ cursor: "pointer", marginLeft: "14%" }}
                      />
                      <Menu
                        id="simple-menu"
                        anchorEl={anchor}
                        keepMounted
                        open={Boolean(anchor)}
                        onClose={handleExpandClose}
                      >
                        {/* <MenuItem onClick={()=>{handleExpandClose()}}>Reply</MenuItem> */}
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
                    <div className="chat__image">
                      <img
                        src={item.data.message.message}
                        onClick={() => setSelected(item.data.message.message)}
                        alt="image"
                      ></img>
                    </div>
                  </div>
                );
              }
            })}
          <div ref={messagesEndRef} />
        </div>
        <div className="chatbox__progressbar">
          {file && <Progressbar file={file} setFile={setFile} />}
        </div>
        <div
          className="chatbox__emoji"
          style={emojiOpen ? { height: "250px" } : { height: "0px" }}
        >
          <Picker
            disableSearchBar
            disableSkinTonePicker
            onEmojiClick={onEmojiClick}
            pickerStyle={{ width: "100%" }}
          />
        </div>

        <div className="chatbox__footer">
          {emojiOpen && (
            <IconButton onClick={() => setEmojiOpen(false)}>
              <CloseOutlinedIcon />
            </IconButton>
          )}
          <IconButton
            onClick={() => {
              setEmojiOpen(true);
            }}
          >
            <InsertEmoticonIcon
              style={emojiOpen ? { color: "#047857" } : { color: "inherit" }}
            />
          </IconButton>
          <form className="text_input">
            <input
              type="text"
              placeholder="Enter a message"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            ></input>
            <button type="submit" onClick={handleSubmit}>
              Send a message
            </button>
          </form>
          {input ? (
            <IconButton>
              <SendIcon style={{ color: "#047857" }} onClick={handleSubmit} />
            </IconButton>
          ) : (
            <div className="image_icon">
              <form>
                <label>
                  <input
                    className="image_input"
                    type="file"
                    onChange={inputHandler}
                  />
                  <span>
                    <PhotoCameraIcon
                      style={{
                        width: "30px",
                        height: "30px",
                        marginBottom: "-20%",
                        color: "grey",
                        cursor: "pointer",
                      }}
                    />
                  </span>
                </label>
              </form>
            </div>
          )}
        </div>
      </div>
      <div>
        <RightPopup />
      </div>
    </div>
  );
}

export default Chatbox;
