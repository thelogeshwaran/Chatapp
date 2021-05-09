import React, { useEffect, useState } from "react";
import { db } from "../Components/Firestore/firebase";
import { Avatar, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import "./Sidebar.css";
import SidebarChat from "./SidebarChat/SidebarChat";
import { auth } from "../Components/Firestore/firebase";
import { useAuthProvider } from "../Context/AuthProvider";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { usePopupProvider } from "../Context/PopupProvider";
import ClearIcon from "@material-ui/icons/Clear";

function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const { user } = useAuthProvider();
  const [anchorEl, setAnchorEl] = useState(null);
  const { setLeftPopup } = usePopupProvider();
  const [search, setSearch] = useState("");

  const signOut = () => {
    auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = db
      .collection("rooms")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snap) => {
        let data = snap.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setFiltered(data);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (search) {
      setRooms(
        filtered.filter((item) =>
          item?.data.name.toUpperCase().includes(search.toUpperCase())
        )
      );
    } else {
      setRooms(filtered);
    }
  }, [search, filtered]);

  console.log(rooms);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div className="sidebar">
      <div className="sidebar__heading">
        <div className="sidebar__headingLeft">
          {user.photoURL ? (
            <Avatar
              src={user.photoURL}
              onClick={() => setLeftPopup("PROFILE")}
              style={{ cursor: "pointer", height: "60px", width: "60px" }}
            />
          ) : (
            <div
              style={{ backgroundColor: "rgb(233, 30, 99)", cursor: "pointer" }}
              onClick={() => setLeftPopup("PROFILE")}
              className="text-avatar"
            >
              {`${user?.displayName?.charAt(0)}${user?.displayName?.charAt(1)}`}{" "}
            </div>
          )}
          <div className="sidebar__headingName">
            <h3>{user.displayName}</h3>
          </div>
        </div>

        <div className="sidebar__headingRight">
          <IconButton>
            <ChatIcon onClick={() => setLeftPopup("NEWCHAT")} />
          </IconButton>
          <IconButton>
            <MoreVertIcon
              aria-controls="simple-menu"
              aria-haspopup="true"
              onClick={handleClick}
            ></MoreVertIcon>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  setLeftPopup("PROFILE");
                  handleClose();
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setLeftPopup("NEWCHAT");
                  handleClose();
                }}
              >
                New Chat
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  signOut();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="search_container">
          {search ? (
            <IconButton>
              <ClearIcon onClick={() => setSearch("")} />
            </IconButton>
          ) : (
            <IconButton>
              <SearchIcon />
            </IconButton>
          )}
          <input
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a chat"
          />
        </div>
      </div>
      <div className="sidebar__body">
        {rooms.map((room) => (
          <SidebarChat key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
