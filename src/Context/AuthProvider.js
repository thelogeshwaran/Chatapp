import React, { createContext, useContext, useState,useEffect } from "react";
import { auth } from "../Components/Common/Firestore/firebase";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const navigate = useNavigate();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setLoading(false);
        navigate("/")
      } else {
        setUser(false);
        setLoading(false);
        navigate("/login")
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
