import React, { useEffect, useState } from "react";
import "./Authentication.css";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../Components/Firestore/firebase";
import firebase from "firebase";
import { useAuthProvider } from "../Context/AuthProvider";
import { toast } from "react-toastify";
import { AiFillCamera, AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";

function Authentication() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { user, setUser } = useAuthProvider();
  const [active, setActive] = useState(true);
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

  const handleLogin = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        clearInputs();
      })
      .catch((error) => {
        toast.error(error.message);
      });
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
  function guestaccount(){
    setEmail("admin@gmail.com");
    setPassword("admin@45")
  }

  console.log(user);
  return (
    <div className="login">
      <div className="login__header">
        <h2>Welcome to ChatApp!</h2>
      </div>
      <section className="forms-section">
        <div className="forms">
          <div className={`form-wrapper ${active ? "is-active" : " "} `}>
            <button
              type="button"
              className="switcher switcher-login"
              onClick={() => {
                setActive(true);
                clearInputs();
              }}
            >
              Login
              <span className="underline"></span>
            </button>
            <form
              className="form form-login"
              onSubmit={(event) => handleLogin(event)}
            >
              <div className="google_auth">
                <FcGoogle
                  style={{ cursor: "pointer", height: "40px", width: "40px" }}
                  onClick={hanldeGoogleAuth}
                />
              </div>
              <div className="form__or">OR</div>
              <div className="input-block">
                <label for="login-email">E-mail</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                ></input>
              </div>
              <div className="input-block ">
                <label for="login-password">Password</label>
                <div className="password-block">
                <input
                  id="login-password"
                  type={passwordShow}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></input>
                <div>
                {passwordShow === "password" ? (
                    <AiFillEye
                      onClick={() => setPasswordShow("text")}
                      style={{
                        margin: "-20px 0px -25px -30px",
                        height: "20px",
                        width: "20px",
                        cursor: "pointer",
                      }}
                    />
                  ) : (
                    <AiFillEyeInvisible
                      onClick={() => setPasswordShow("password")}
                      style={{
                        margin: "-20px 0px -25px -30px",
                        height: "20px",
                        width: "20px",
                        cursor: "pointer",
                      }}
                    />
                  )}
                </div>
                </div>
              </div>
              <button type="submit" className="btn-login">
                Login
              </button>
              <button type="button" className="btn-login guest" onClick={()=> guestaccount()}>
                Guest
              </button>
            </form>
          </div>

          <div className={`form-wrapper ${active ? "" : "is-active"} `}>
            <button
              type="button"
              className="switcher switcher-signup"
              onClick={() => {
                setActive(false);
                clearInputs();
              }}
            >
              Sign Up
              <span className="underline"></span>
            </button>
            <form
              className="form form-signup"
              onSubmit={(event) => handleSignUp(event)}
            >
              <div className="google_auth">
                <FcGoogle
                  style={{ cursor: "pointer", height: "40px", width: "40px" }}
                  onClick={hanldeGoogleAuth}
                />
              </div>
              <div className="form__or">OR</div>
              <div className="input-block">
                <label for="name">Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </div>
              <div className="input-block">
                <label for="signup-email">E-mail</label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></input>
              </div>
              <div className="input-block">
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
      </section>
    </div>
  );
}

export default Authentication;
