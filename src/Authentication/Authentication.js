import React, { useEffect, useState } from 'react';
import "./Authentication.css";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import firebase from "firebase";
import { useAuthProvider } from "../Context/AuthProvider";



function Authentication() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const { user, setUser } = useAuthProvider();
    
    const [ active, setActive] = useState(true);

    useEffect(()=>{
        auth.onAuthStateChanged((user) => {
            if(user){
                setUser(user);
            }else{
                setUser(false)
            }
        })
    }, [])

    const clearInputs = () => {
        setName("");
        setEmail("");
        setPassword("");
    }


    const handleLogin = (event) => {
        event.preventDefault();
        auth
        .signInWithEmailAndPassword(email, password)
        .then((user) => {
            clearInputs();
         })
        .catch( (error) => {
            alert(error.message)
        })
    }

    const handleSignUp = (event) => {
        event.preventDefault();
        auth.createUserWithEmailAndPassword(email, password)
        .then((result)=> {
            result.user
            .updateProfile({
                displayName: name
            })
            .then(()=>{
                clearInputs();
            })
        })
        .catch((error) => {
            alert(error.message)
        })
    }

    const hanldeGoogleAuth = () => {
        auth.signInWithPopup( new firebase.auth.GoogleAuthProvider())
        .catch((error)=>{
            alert(error.message)
        })
    }


    console.log(user)
    return (
        <div className="login">
            <div className="login__header">
                <h2>Welcome to ChatApp!</h2>
            </div>
        <section className="forms-section">
            <div className="forms">
                <div className={`form-wrapper ${ active ? "is-active" : " "} `}>
                <button type="button" className="switcher switcher-login" onClick={()=> {setActive(true);clearInputs();}}>
                    Login
                    <span className="underline"></span>
                </button>
                <form className="form form-login" onSubmit={(event) => handleLogin(event)}>
                    <div className="google_auth">
                    <FcGoogle style={{ cursor:"pointer", height:"40px", width:"40px"}} onClick={hanldeGoogleAuth}/>
                    </div>
                    <div className="form__or">OR</div>
                    <div className="input-block">
                        <label for="login-email">E-mail</label>
                        <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required></input>
                    </div>
                    <div className="input-block">
                        <label for="login-password">Password</label>
                        <input id="login-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    </div>
                    <div>
                    Credentials : Email - testuser@gmail.com 
                    <br/> password : test@45
                    </div>
                    <button type="submit" className="btn-login" >Login</button>
                </form>
                
                </div>



                <div className={`form-wrapper ${ active ? "" : "is-active"} `}>
                    <button type="button" className="switcher switcher-signup" onClick={()=> {setActive(false);clearInputs();}}>
                        Sign Up
                        <span className="underline"></span>
                    </button>
                <form className="form form-signup" onSubmit={(event) => handleSignUp(event)}>
                    <div className="google_auth">
                    <FcGoogle style={{ cursor:"pointer", height:"40px", width:"40px"}} onClick={hanldeGoogleAuth}/>
                    </div>
                    <div className="form__or">OR</div>
                    <div className="input-block">
                        <label for="name">Name</label>
                        <input id="name" type="text" required  value={name} onChange={(e) => setName(e.target.value)}></input>
                    </div>
                    <div className="input-block">
                        <label for="signup-email">E-mail</label>
                        <input id="signup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}></input>
                    </div>
                    <div className="input-block">
                        <label for="signup-password">Password</label>
                        <input id="signup-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    </div>
                    <button type="submit" className="btn-signup" >Continue</button>
                </form>
                </div>

            </div>
            </section>
         </div>
    )
}

export default Authentication
