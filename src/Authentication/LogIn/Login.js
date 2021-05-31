import React, { useEffect, useState } from "react";
import "./Login.css";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../../Components/Common/Firestore/firebase";
import firebase from "firebase";
import { useAuthProvider } from "../../Context/AuthProvider";
import { toast } from "react-toastify";
import { AiFillEye } from "react-icons/ai";
import { AiFillEyeInvisible } from "react-icons/ai";

function Login({ active, setActive }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useAuthProvider();
  const [passwordShow, setPasswordShow] = useState("password");

  console.log(active);
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

  const hanldeGoogleAuth = () => {
    auth
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch((error) => {
        toast.error(error.message);
      });
  };
  function guestaccount() {
    setEmail("admin@gmail.com");
    setPassword("admin@45");
  }
  return (
    <div>
      <div
        className={`login-wrapper ${active === "LOGIN" ? "is-active" : " "} `}
      >
        <button
          type="button"
          className="switcher-login"
          onClick={() => {
            setActive("LOGIN");
            clearInputs();
          }}
        >
          Login
          <span className="underline"></span>
        </button>
        <form className="form-login" onSubmit={(event) => handleLogin(event)}>
          <div className="login__header">
            <h3>Welcome Back</h3>
          </div>
          <div className="google_auth">
            <FcGoogle
              style={{ cursor: "pointer", height: "40px", width: "40px" }}
              onClick={hanldeGoogleAuth}
            />
          </div>
          <div className="form__or">OR</div>
          <div className="login-block">
            <label for="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            ></input>
          </div>
          <div className="login-block ">
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
          <button
            type="button"
            className="btn-login guest"
            onClick={() => guestaccount()}
          >
            Guest
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
