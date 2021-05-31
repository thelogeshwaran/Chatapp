import React, { useState, useEffect } from "react";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import "./Searchbox.css";
import SearchIcon from "@material-ui/icons/Search";
import { IconButton } from "@material-ui/core";
import ClearIcon from "@material-ui/icons/Clear";
import { usePopupProvider } from "../../../Context/PopupProvider";
import { useMessagesProvider } from "../../../Context/MessagesProvider";

function Searchbox() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const { setRightPopup } = usePopupProvider();
  const { messages } = useMessagesProvider();

  useEffect(() => {
    {
      search
        ? setData(
            messages.filter((item) =>
              item.data.message.message
                ?.toUpperCase()
                .includes(search.toUpperCase())
            )
          )
        : setData([]);
    }
  }, [search, messages]);

  return (
    <div className="searchbox">
      <div className="searchbox__header">
        <KeyboardBackspaceIcon
          onClick={() => setRightPopup("")}
          style={{ cursor: "pointer" }}
        />
        <h2>Search Messages</h2>
      </div>
      <div className="searchbox__searchbar">
        <div className="searchbox_container">
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
            className="search__input"
            type="text"
            value={search}
            autoFocus
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search a chat"
          />
        </div>
      </div>
      <div className="searchbox__body">
        {data &&
          data.map((item) => (
            <p className={`searchbox__message`}>
              <span className="searchbox__name">{item.data.name}</span>
              <br />
              {item.data.message.message}
              <span className="searchbox__timestamp">
                {new Date(item.data.timeStamp?.toDate()).toLocaleString()}
              </span>
            </p>
          ))}
      </div>
    </div>
  );
}

export default Searchbox;
