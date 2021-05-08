import { useEffect, useState } from "react";
import firebase from "firebase";
import { projectStorage, db} from "../../firebase";



const useStorage = (file) => {
  const [progress, setProgress] = useState(null);
  const [url, setUrl] = useState(null);
  const [error, setError] = useState(null);
  


  useEffect(() => {
    const storageRef = projectStorage.ref(`images/${file.name}`);

    storageRef.put(file).on(
      "state_changed",
      (snap) => {
        const percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
        setProgress(percentage);
      },
      (error) => {
        setError(error);
      },
      async () => {
        const url = await storageRef.getDownloadURL();
          setUrl(url);
      }
    );
  }, [file]);

  return {
    url,
    progress,
    error,
  };
};

export default useStorage;


















// import { useEffect, useState } from "react";
// import firebase from "firebase";
// import { projectStorage, db} from "../../firebase";
// import { useAuthProvider } from "../../Context/AuthProvider";
// import { useParams } from "react-router-dom";


// const firestorage = (file, user, roomId) => {


//     const storageRef = projectStorage.ref(`images/${file.name}`);

//     storageRef.put(file).on(
//       "state_changed",
//       (snap) => {
//         const percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
    
//       },
//       (error) => {
//         alert(error);
//       },
//       async () => {
//         const url = await storageRef.getDownloadURL();
//         console.log(url)
//         if(url){
//         db.collection("rooms")?.doc(roomId)
//         .collection("messages")
//         .add({
//             userId : user.uid,
//             message : { type : "image", message : url},
//             timeStamp : firebase.firestore.FieldValue.serverTimestamp(),
//             name : user.displayName,
//             starred: false
//         })
//         }

        
//       }
//     );
 
    

  
// };

// export default firestorage;
