import React, { useEffect, useState } from "react";
import "./LeftPopup.css";
import Profile from "../Profile/Profile";
import { usePopupProvider } from "../../Context/PopupProvider";
import NewChat from "../NewChat/NewChat";

function LeftPopup() {
  const [component, setComponent] = useState("");
  const { leftPopup } = usePopupProvider();

  useEffect(() => {
    const item = () => {
      switch (leftPopup) {
        case "NEWCHAT":
          return <NewChat />;
        case "PROFILE":
          return <Profile />;
        default:
          break;
      }
    };
    setComponent(item);
  }, [leftPopup]);

  return (
    <div className="left" style={{ left: leftPopup ? "0px" : "-600px" }}>
      {component}
    </div>
  );
}

export default LeftPopup;
