import React, { createContext, useContext, useState,useEffect } from "react";
import { auth } from "../Components/Common/Firestore/firebase"

const AuthContext = createContext();

export function AuthProvider({ children }) {
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoading(false)
      } else {
        setUser(false);
      }
    });
  }, []);

  const [user, setUser] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <AuthContext.Provider value={{ user, setUser,loading, setLoading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuthProvider() {
  return useContext(AuthContext);
}
