import { useEffect, useState } from "react";
import { projectStorage } from "../Firestore/firebase";

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
