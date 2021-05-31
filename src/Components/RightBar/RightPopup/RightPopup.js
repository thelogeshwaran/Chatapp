import React, { useEffect, useState } from "react";
import "./RightPopup.css";
import Starred from "../Starred/Starred";
import GroupInfo from "../GroupInfo/GroupInfo";
import Searchbox from "../Searchbox/Searchbox";
import { usePopupProvider } from "../../../Context/PopupProvider";

function RightPopup() {
  const { rightPopup } = usePopupProvider();
  const [component, setComponent] = useState("");

  useEffect(() => {
    const item = () => {
      switch (rightPopup) {
        case "STARRED":
          return <Starred />;
        case "SEARCH":
          return <Searchbox />;
        case "GROUPINFO":
          return <GroupInfo />;
        default:
          break;
      }
    };
    setComponent(item);
  }, [rightPopup]);

  return (
    <div
      className="rightbar"
      style={{ display: rightPopup ? "block" : "none" }}
    >
      {component}
    </div>
  );
}

export default RightPopup;
