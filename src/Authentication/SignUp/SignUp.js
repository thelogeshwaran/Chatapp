import React, { useEffect, useState } from "react";
import "./SignUp.css";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../../Components/Common/Firestore/firebase";
import firebase from "firebase";
import { useAuthProvider } from "../../Context/AuthProvider";
import { toast } from "react-toastify";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";

function SignUp({ active, setActive }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { setUser } = useAuthProvider();
  const [passwordShow, setPasswordShow] = useState("password");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });
  }, []);

  const clearInputs = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSignUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        result.user
          .updateProfile({
            displayName: name,
          })
          .then(() => {
            clearInputs();
          });
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const hanldeGoogleAuth = () => {
    auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div>
      <div
        className={`form-content ${active === "SIGNUP" ? "is-active" : " "} `}
      >
        <button
          type="button"
          className="switcher switcher-signup"
          onClick={() => {
            setActive("SIGNUP");
            clearInputs();
          }}
        >
          Sign Up
          <span className="underline"></span>
        </button>
        <form className="form-signup" onSubmit={(event) => handleSignUp(event)}>
          <div className="signup__header">
            <h3>Create New Account</h3>
          </div>
          <div className="google_auth">
            <FcGoogle
              style={{ cursor: "pointer", height: "40px", width: "40px" }}
              onClick={hanldeGoogleAuth}
            />
          </div>
          <div className="or__content">OR</div>
          <div className="signup-block">
            <label for="name">Name</label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>
          <div className="signup-block">
            <label for="signup-email">E-mail</label>
            <input
              id="signup-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="signup-block">
            <label for="signup-password">Password</label>
            <div className="password-block">
              <input
                id="signup-password"
                type={passwordShow}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              {passwordShow === "password" ? (
                <AiFillEye
                  onClick={() => setPasswordShow("text")}
                  style={{
                    margin: "20px 0px -25px -30px",
                    height: "20px",
                    width: "20px",
                    cursor: "pointer",
                  }}
                />
              ) : (
                <AiFillEyeInvisible
                  onClick={() => setPasswordShow("password")}
                  style={{
                    margin: "20px 0px -25px -30px",
                    height: "20px",
                    width: "20px",
                    cursor: "pointer",
                  }}
                />
              )}
            </div>
          </div>
          <button type="submit" className="btn-signup btn-login">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
