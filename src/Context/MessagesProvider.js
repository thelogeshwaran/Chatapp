import React, { createContext, useContext, useState, useEffect } from "react";
import {db} from "../firebase"

const MessagesContext = createContext();

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [ chatId, setChatId] = useState("");
  const [upload, setUpload] = useState("");

  useEffect(() => {
    if (chatId) {
      db.collection("rooms")
        .doc(chatId)
        .onSnapshot((snap) => setRoom(snap.data()));


        db.collection("rooms")
        ?.doc(chatId)
        .collection("messages")
        .orderBy("timeStamp", "asc")
        .onSnapshot( (snap) => {
            let document = snap.docs.map((doc) =>({
              id : doc.id,
              data : doc.data()
            })
            )
            setMessages(document)
        })
    }
  }, [chatId]);

  return (
    <MessagesContext.Provider value={{ messages, setMessages, room, setRoom, chatId, setChatId, upload, setUpload}}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessagesProvider() {
  return useContext(MessagesContext);
}
