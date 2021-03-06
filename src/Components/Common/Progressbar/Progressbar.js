import React, { useEffect } from "react";
import useStorage from "../../../Components/Common/Firestorage/useFirestorage";
import { motion } from "framer-motion";
import "./Progressbar.css";
import { useMessagesProvider } from "../../../Context/MessagesProvider";
import { useParams } from "react-router-dom";
import { useAuthProvider } from "../../../Context/AuthProvider";
import firebase from "firebase";
import { auth, db } from "../Firestore/firebase";
import { toast } from "react-toastify";

const Progressbar = ({ file, setFile, setImageUrl }) => {
  const { url, progress } = useStorage(file);
  const { user } = useAuthProvider();
  const { roomId } = useParams();
  const { upload } = useMessagesProvider();

  useEffect(() => {
    if (url) {
      switch (upload) {
        case "MESSAGE":
          db.collection("rooms")
            ?.doc(roomId)
            .collection("messages")
            .add({
              userId: user.uid,
              message: { type: "image", message: url },
              timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
              name: user.displayName,
              starred: false,
            });
          break;
        case "GROUPIMAGE":
          db.collection("rooms").doc(roomId).update({
            url: url,
          });
          break;
        case "PROFILE":
          setImageUrl(url);
          auth.currentUser.updateProfile({
            photoURL: url,
          });
        default:
          toast.error("Sorry, something went wrong");
          break;
      }
      setFile(null);
    }
  }, [url, setFile]);

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: progress + "%" }}
      className="progress-bar"
    ></motion.div>
  );
};

export default Progressbar;
