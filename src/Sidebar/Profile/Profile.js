import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import "./Profile.css";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { useAuthProvider } from "../../Context/AuthProvider";
import { auth } from "../../Components/Firestore/firebase";
import { usePopupProvider } from "../../Context/PopupProvider";
import { useMessagesProvider } from "../../Context/MessagesProvider";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Progressbar from "../../Components/Progressbar/Progressbar";

function Profile() {
  const [disabled, setDisabled] = useState(true);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const { user } = useAuthProvider();
  const { setLeftPopup, setSelected } = usePopupProvider();
  const { setUpload } = useMessagesProvider();
  const [anchorEl, setAnchorEl] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setName(user.displayName);
    setImageUrl(user.photoURL);
  }, []);

  const handleSubmit = () => {
    auth.currentUser.updateProfile({
      displayName: name,
    });
  };

  const handleView = () => {
    setSelected(user.photoURL);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  function inputHandler(e) {
    const image = e.target.files[0];
    const types = ["image/jpeg", "image/png"];
    if (image && types.includes(image.type)) {
      setFile(image);
      setUpload("PROFILE");
      // setError("")
    } else {
      // setError("Please upload the image of file type png or jpeg!");
      setFile(null);
    }
  }
  const handleDelete = () => {
    auth.currentUser.updateProfile({
      photoURL: "",
    });

    setImageUrl("");
  };

  return (
    <div className="profile">
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <form>
          <label>
            <input
              className="profile__imageinput"
              type="file"
              onChange={inputHandler}
            ></input>
            <MenuItem onClick={handleClose}>Change Photo</MenuItem>
          </label>
          <MenuItem
            onClick={() => {
              handleView();
              handleClose();
            }}
          >
            View photo
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleClose();
              handleDelete();
            }}
          >
            Remove photo
          </MenuItem>
        </form>
      </Menu>
      <div className="profile__header">
        <KeyboardBackspaceIcon
          onClick={() => setLeftPopup("")}
          style={{ cursor: "pointer" }}
        />
        <h2>Profile</h2>
      </div>
      <div className="profile__avatar">
        <Avatar
          alt="Remy Sharp"
          src={imageUrl}
          style={{ height: "200px", width: "200px" }}
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleClick}
        />
      </div>
      {file && (
        <Progressbar file={file} setFile={setFile} setImageUrl={setImageUrl} />
      )}
      <div className="profile__info">
        <div className="profile__infohead">Your name</div>
        <div className="profile__edit">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={disabled}
            style={{ borderBottom: disabled ? "none" : "1px solid #00BFA5" }}
          ></input>
          {disabled ? (
            <IconButton onClick={() => setDisabled(false)}>
              <EditIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() => {
                setDisabled(true);
                handleSubmit();
              }}
            >
              <CheckIcon />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
