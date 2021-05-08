import React,{ useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import "./GroupInfo.css";
import EditIcon from '@material-ui/icons/Edit';
import {IconButton } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { usePopupProvider } from "../../Context/PopupProvider";
import MenuItem from '@material-ui/core/MenuItem';  
import Menu from '@material-ui/core/Menu';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { useMessagesProvider } from "../../Context/MessagesProvider";
import Progressbar from "../Progressbar/Progressbar";





function GroupInfo() {
    const [disabled, setDisabled] = useState(true);
    const [ name, setName ] = useState("");
    const [ description, setDescription] = useState("")
    const [anchorEl, setAnchorEl] = useState(null);
    const [ url, setUrl ] = useState("");
    const [ descriptionDisable, setDescriptionDisable] = useState(true)
    const [file, setFile] = useState(null);
    const { roomId } = useParams();
    const { setRightPopup, setSelected } = usePopupProvider();
    const {room, setUpload} = useMessagesProvider();
    



    useEffect(() => {
        setName(room.name);
        { room.description ? setDescription(room.description) : setDescription("Add Description")}
        setUrl(room.url)
      }, [room]);

      function inputHandler(e){

        const image = e.target.files[0] 
        const types =["image/jpeg","image/png"]
        if(image && types.includes(image.type)){
            setFile(image);
            setUpload("GROUPIMAGE")
            // setError("")
        }else {
            // setError("Please upload the image of file type png or jpeg!");
            setFile(null);
        }
        
        
    }

    const handleName = ()=>{
        db.collection("rooms")
        .doc(roomId)
        .update({
            name : name
        }
        )
    }

    const handleDescription=()=>{
        db.collection("rooms")
        .doc(roomId)
        .update({
            description : description
        }
        )
    }

    const handleView = () =>{
        setSelected(url)
    } 


    const handleClose = () => {
        setAnchorEl(null);
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };


    //   console.log("room",room)

    const handleDelete = () => {
        db.collection("rooms")
        .doc(roomId)
        .update({
            url : ""
        }
        )
    }

    return (
        <div className="group">
            <div className="group__header">
               <KeyboardBackspaceIcon onClick={()=>setRightPopup("")} style={{cursor:"pointer"}}/>
               <h3>Group Info</h3>
           </div>
            <div className="group__body">
            <div className="group__avatar">
            <Avatar alt="Remy Sharp" src={url} style={{ height:"200px", width:"200px"}} aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}/>
            <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <form className="group__form">
                    <label>
                            <input className="group__input" type="file" onChange={inputHandler}></input>
                            <MenuItem onClick={handleClose }>Change Photo</MenuItem>
                        </label>
                    <MenuItem onClick={()=> {handleView(); handleClose();}}>View photo</MenuItem>
                    <MenuItem onClick={ ()=> { handleDelete(); handleClose();}}>Remove photo</MenuItem>
                    
                    </form>
                </Menu>
            </div>
            { file && <Progressbar file={file} setFile={setFile}/> }

            <div className="group__info">
                
                <div className="group__edit">
                <input value={name} onChange={(e)=> setName(e.target.value)} disabled={disabled} style={ { borderBottom : disabled ? "none" : "1px solid #00BFA5" }}></input>
                {
                    disabled ? <IconButton onClick={()=> setDisabled(false)}><EditIcon/></IconButton> :
                    <IconButton onClick={()=> {setDisabled(true); handleName();}}><CheckIcon/></IconButton>
                }
                </div>
                <div className="group__created">Created At - {new Date(room.createdAt?.toDate()).toLocaleString()}</div>
            </div>
            <div className="group__desinfo">
                <div className="group__infohead">Description</div>
                <div className="group__desedit">
                <input value={description} onChange={(e)=> setDescription(e.target.value)} disabled={descriptionDisable} style={ { borderBottom : descriptionDisable     ? "none" : "1px solid #00BFA5" }}></input>
                {
                    descriptionDisable ? <IconButton onClick={()=> setDescriptionDisable(false)}><EditIcon/></IconButton> :
                    <IconButton onClick={()=> {setDescriptionDisable(true); handleDescription();}}><CheckIcon/></IconButton>
                }
                </div>
            </div>
           <div className="group__accordion">
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                >
                <div className="accordion__head">Media</div>
                </AccordionSummary>
                <AccordionDetails>
                <div>2</div>
                </AccordionDetails>
            </Accordion>
           </div>
           <div  className="group__accordion">
           <Accordion >
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            >
            <div className="accordion__head" >Participants</div>
            </AccordionSummary>
            <AccordionDetails>
            <Typography>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                sit amet blandit leo lobortis eget.
            </Typography>
            </AccordionDetails>
         </Accordion>    
           </div>
            </div>
            
         </div>
    )
}

export default GroupInfo
