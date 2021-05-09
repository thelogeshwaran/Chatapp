import React from 'react'
import Sidebar from "../Sidebar/Sidebar";
import Chatbox from "../Chatbox/Chatbox";
import { usePopupProvider } from "../Context/PopupProvider";
import LeftPopup from "../Sidebar/LeftPopup/LeftPopup";
import "./Pages.css"

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
    )
}

export default HomePage
