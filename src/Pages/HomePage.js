import React from "react";
import Sidebar from "../Components/SideBar/Sidebox/Sidebar";
import Chatbox from "../Components/ChatBar/Chatbox/Chatbox";
import LeftPopup from "../Components/LeftBar/LeftPopup/LeftPopup";
import "./Pages.css";

function HomePage() {
  return (
    <div>
      <div className="desktop__body">
        <Sidebar />
        <LeftPopup />
        <Chatbox />
      </div>
      <div className="mob__body">
        <Sidebar />
        <LeftPopup />
      </div>
    </div>
  );
}

export default HomePage;
