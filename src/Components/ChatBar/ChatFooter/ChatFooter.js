import React, { useState } from "react";
import "./ChatFooter.css";
import Progressbar from "../../Common/Progressbar/Progressbar";
import SendIcon from "@material-ui/icons/Send";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import Picker from "emoji-picker-react";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import { IconButton } from "@material-ui/core";
import { db } from "../../Common/Firestore/firebase";
import { useParams } from "react-router-dom";
import firebase from "firebase";
import { useAuthProvider } from "../../../Context/AuthProvider";
import { useMessagesProvider } from "../../../Context/MessagesProvider";
import { toast } from "react-toastify";

function ChatFooter({ reply, setReply }) {
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const { user } = useAuthProvider();
  const { setUpload } = useMessagesProvider();

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
          reply: reply ? reply.data : "",
        });

      db.collection("rooms").doc(roomId).update({
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
    setReply("");
    setInput("");
  };

  function inputHandler(e) {
    const image = e.target.files[0];
    const types = ["image/jpeg", "image/png"];
    if (image && types.includes(image.type)) {
      setFile(image);
      setUpload("MESSAGE");
      db.collection("rooms").doc(roomId).update({
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      toast.error("Please upload the image of file type png or jpeg!");
      setFile(null);
    }
  }

  return (
    <div>
      <div>
        {reply && (
          <div className="reply__body">
            <div
              className="reply__content"
              style={{
                borderLeft:
                  reply.data.userId === user.uid
                    ? "4px solid #29bb89"
                    : "4px solid #3edbf0",
              }}
            >
              <div
                className="reply__name"
                style={{
                  color: reply.data.userId === user.uid ? "#29bb89" : "#3edbf0",
                }}
              >
                {reply.data.userId === user.uid ? "You" : reply.data.name}
              </div>
              <div className="reply__message">
                {reply.data.message.type === "text"
                  ? reply.data.message.message.substring(0, 60)
                  : "Image"}
              </div>
            </div>
            <div>
              <IconButton onClick={() => setReply("")}>
                <CloseOutlinedIcon />
              </IconButton>
            </div>
          </div>
        )}
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
  );
}

export default ChatFooter;
