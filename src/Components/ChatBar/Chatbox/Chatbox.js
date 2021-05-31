import React, { useEffect, useState } from "react";
import "./Chatbox.css";
import { useParams } from "react-router-dom";
import RightPopup from "../../RightBar/RightPopup/RightPopup";
import { useMessagesProvider } from "../../../Context/MessagesProvider";
import ChatHeader from "../ChatHeader/ChatHeader";
import ChatContainer from "../ChatContainer/ChatContainer";
import ChatFooter from "../ChatFooter/ChatFooter";

function Chatbox() {
  const { roomId } = useParams();
  const { setChatId } = useMessagesProvider();
  const [reply, setReply] = useState("");

  useEffect(() => {
    setChatId(roomId);
    setReply("");
  }, [roomId]);

  return (
    <div className="chatbox">
      <div className="chatbox__content">
        <ChatHeader />
        <div className="chatbox__body">
          <ChatContainer setReply={setReply} />
        </div>
        <div>
          <ChatFooter reply={reply} setReply={setReply} />
        </div>
      </div>
      <div>
        <RightPopup />
      </div>
    </div>
  );
}

export default Chatbox;
