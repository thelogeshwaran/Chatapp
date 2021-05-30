import React, {  useState } from "react";
import "./Authentication.css";
import Login from "./LogIn/Login";
import SignUp from "./SignUp/SignUp";

function Authentication() {

  const [active, setActive] = useState("LOGIN");
  
  return (
    <div className="auth">
      <div className="auth__header">
        <h2>Welcome to ChatApp!</h2>
      </div>
      <section className="forms-section">
        <div className="forms">
          <div className={`form-wrapper ${active ==="LOGIN" ? "is-active" : " "} `}>
          <Login active={active} setActive={setActive}/>
          </div>
          <div className={`form-wrapper ${active ==="SIGNUP" ? "is-active" : ""} `}>
          <SignUp active={active} setActive={setActive}/>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Authentication;
