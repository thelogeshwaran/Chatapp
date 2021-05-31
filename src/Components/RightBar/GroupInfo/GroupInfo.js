import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import "./GroupInfo.css";
import EditIcon from "@material-ui/icons/Edit";
import { IconButton } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { usePopupProvider } from "../../../Context/PopupProvider";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { useParams } from "react-router-dom";
import { db } from "../../Common/Firestore/firebase";
import { useMessagesProvider } from "../../../Context/MessagesProvider";
import Progressbar from "../../Common/Progressbar/Progressbar";
import DeleteIcon from "@material-ui/icons/Delete";
import { useNavigate } from "react-router-dom";
import { useAuthProvider } from "../../../Context/AuthProvider";
import { toast } from "react-toastify";


function GroupInfo() {
  const [disabled, setDisabled] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [url, setUrl] = useState("");
  const [descriptionDisable, setDescriptionDisable] = useState(true);
  const [file, setFile] = useState(null);
  const { roomId } = useParams();
  const { setRightPopup, setSelected } = usePopupProvider();
  const { room, setUpload, messages } = useMessagesProvider();
  const navigate = useNavigate();
  const { user } = useAuthProvider();

  useEffect(() => {
    setName(room?.name);
    {
      room?.description
        ? setDescription(room?.description)
        : setDescription("Add Description");
    }
    setUrl(room?.url);
  }, [room]);

  function inputHandler(e) {
    const image = e.target.files[0];
    const types = ["image/jpeg", "image/png"];
    if (image && types.includes(image.type)) {
      setFile(image);
      setUpload("GROUPIMAGE");
     
    } else {
     
      toast.error("Please upload the image of file type png or jpeg!")
      setFile(null);
    }
  }

  const handleName = () => {
    db.collection("rooms").doc(roomId).update({
      name: name,
    });
  };

  const handleDescription = () => {
    db.collection("rooms")
      .doc(roomId)
      .update({
        description: description[0].toUpperCase() + description.slice(1),
      });
  };

  const handleView = () => {
    setSelected(url);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDelete = () => {
    db.collection("rooms").doc(roomId).update({
      url: "",
    });
  };

  const handleGrpDelete = () => {
    if (room.admin === user.uid) {
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .get()
        .then((res) => {
          res.forEach((element) => {
            element.ref.delete();
          });
        });
      navigate("/");
      setRightPopup("");

      db.collection("rooms").doc(roomId).delete();
    }else{
      toast.error("You cannot delete others group.")
    }
  };

  return (
    <div className="group">
      <div className="group__header">
        <KeyboardBackspaceIcon
          onClick={() => setRightPopup("")}
          style={{ cursor: "pointer" }}
        />
        <h3>Group Info</h3>
      </div>
      <div className="group__body">
        <div className="group__avatar">
          <Avatar
            alt="Remy Sharp"
            src={url}
            style={{ height: "200px", width: "200px" }}
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
          >
            <form className="group__form">
              <label>
                <input
                  className="group__input"
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
                  handleDelete();
                  handleClose();
                }}
              >
                Remove photo
              </MenuItem>
            </form>
          </Menu>
        </div>
        {file && <Progressbar file={file} setFile={setFile} />}

        <div className="group__info">
          <div className="group__edit">
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
                  handleName();
                }}
              >
                <CheckIcon />
              </IconButton>
            )}
          </div>
          <div className="group__created">
            Created At - {new Date(room?.createdAt?.toDate()).toLocaleString()}
          </div>
        </div>
        <div className="group__desinfo">
          <div className="group__infohead">Description</div>
          <div className="group__desedit">
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={descriptionDisable}
              style={{
                borderBottom: descriptionDisable ? "none" : "1px solid #00BFA5",
              }}
            ></input>
            {descriptionDisable ? (
              <IconButton onClick={() => setDescriptionDisable(false)}>
                <EditIcon />
              </IconButton>
            ) : (
              <IconButton
                onClick={() => {
                  setDescriptionDisable(true);
                  handleDescription();
                }}
              >
                <CheckIcon />
              </IconButton>
            )}
          </div>
        </div>
        <div className="group__accordion">
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="accordion__head">Media</div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="group__media">
                {messages &&
                  messages.map((item) => {
                    if (item.data.message.type === "image") {
                      return (
                        <div
                          className="group__mediaImage"
                          onClick={() => setSelected(item.data.message.message)}
                        >
                          <img src={item.data.message.message}></img>
                        </div>
                      );
                    }
                  })}
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
        <div className="group__delete">
          <div className="group__deleteHeader">Delete Group</div>
          <div>
            <IconButton>
              <DeleteIcon
                style={{ color: "red" }}
                onClick={() => handleGrpDelete()}
              />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupInfo;
