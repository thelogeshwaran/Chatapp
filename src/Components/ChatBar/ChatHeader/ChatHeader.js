import React, { useState } from "react";
import Fade from "@material-ui/core/Fade";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { Link } from "react-router-dom";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import { Avatar, IconButton } from "@material-ui/core";
import { usePopupProvider } from "../../../Context/PopupProvider";
import { useMessagesProvider } from "../../../Context/MessagesProvider";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { useParams } from "react-router-dom";
import { db } from "../../Common/Firestore/firebase";
import "./ChatHeader.css";

function ChatHeader() {
  const { setRightPopup } = usePopupProvider();
  const [anchorEl, setAnchorEl] = useState(null);
  const { roomId } = useParams();
  const { room } = useMessagesProvider();

  const handleClearMessages = () => {
    db.collection("rooms")
      .doc(roomId)
      .collection("messages")
      .get()
      .then((res) => {
        res.forEach((element) => {
          element.ref.delete();
        });
      });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <div className="chatbox__heading">
        <div className="chatbox__backicon">
          <Link to="/">
            <IconButton>
              <ArrowBackIosIcon />
            </IconButton>
          </Link>
        </div>
        <Avatar
          src={room?.url}
          onClick={() => setRightPopup("GROUPINFO")}
          style={{ cursor: "pointer" }}
        />
        <div className="chatbox__headingInfo">
          <h3>{room?.name}</h3>
          <p>{room?.description}</p>
        </div>
        <div className="chatbox__hedingRight">
          <IconButton>
            <SearchIcon onClick={() => setRightPopup("SEARCH")} />
          </IconButton>
          <IconButton>
            <MoreVertIcon
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            />
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              TransitionComponent={Fade}
            >
              <MenuItem
                onClick={() => {
                  setRightPopup("GROUPINFO");
                  handleClose();
                }}
              >
                Group Info
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setRightPopup("STARRED");
                  handleClose();
                }}
              >
                Starred Messages
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleClearMessages();
                }}
              >
                Clear Messages
              </MenuItem>
            </Menu>
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
