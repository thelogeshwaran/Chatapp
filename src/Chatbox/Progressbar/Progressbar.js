import React, { useEffect } from "react";
import useStorage from "../../Components/Firestorage/useFirestorage";
import { motion } from "framer-motion";
import "./Progressbar.css";
import { useMessagesProvider } from "../../Context/MessagesProvider";
import { useParams } from "react-router-dom";
import { useAuthProvider } from "../../Context/AuthProvider";
import firebase from "firebase";
import { auth,db} from "../../firebase";




const Progressbar =({file, setFile, setImageUrl})=>{
    const {url , progress } = useStorage(file);
    const { user } = useAuthProvider();
     const { roomId } = useParams();
     const { upload } = useMessagesProvider();
    
    useEffect(()=>{
        // {
        //     url && 
           
        //     }
        // }


        if(url){
            switch (upload) {

                case "MESSAGE":
                    db.collection("rooms")?.doc(roomId)
                    .collection("messages")
                    .add({
                        userId : user.uid,
                        message : { type : "image", message : url},
                        timeStamp : firebase.firestore.FieldValue.serverTimestamp(),
                        name : user.displayName,
                        starred: false
                    })
                    break;
                case "GROUPIMAGE":
                    db.collection("rooms")
                    .doc(roomId)
                    .update({
                        url : url
                    })    
                    break;
                case "PROFILE":
                    setImageUrl(url)
                    auth.currentUser.updateProfile({
                        photoURL : url
                    })    
                default:
                    console.log("something wrong")
                    break;
                }
            setFile(null);
            }
        
    },[url,setFile])

    return (
        <motion.div 
        initial={{width : 0}}
        animate={{width : progress + "%"}}
         className="progress-bar"></motion.div>
    )
}

export default Progressbar


