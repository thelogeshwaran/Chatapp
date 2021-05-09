import React, { createContext, useContext, useState } from "react";

const PopupContext = createContext();

export function PopupProvider({ children }) {
  const [leftPopup, setLeftPopup] = useState("");
  const [selected, setSelected] = useState(null);
  const [rightPopup, setRightPopup] = useState("");

  return (
    <PopupContext.Provider
      value={{
        leftPopup,
        setLeftPopup,
        selected,
        setSelected,
        rightPopup,
        setRightPopup,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
}

export function usePopupProvider() {
  return useContext(PopupContext);
}
