import React, { useState } from "react";
import "../CSS/Signup.css"
import Home from "./Home";

// import { Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDE8Sszw1i0P0VH6UEZP2Tr-s-sV94ry0M",
    authDomain: "instagram-ed084.firebaseapp.com",
    projectId: "instagram-ed084",
    storageBucket: "instagram-ed084.appspot.com",
    messagingSenderId: "505061943423",
    appId: "1:505061943423:web:01e31c3eee7724ac36f74a",
    measurementId: "G-YZW3T2S3SV"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);


const Signup = () => {

    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [signUpConfirmPassword, setSignUpCofirmPassword] = useState("");

    const handleChange = (e) => {
        if (e.target.id === "signinemail") {
            setSignInEmail(e.target.value);
        } else if (e.target.id === "signinpassword") {
            setSignInPassword(e.target.value);
        } else if (e.target.id === "signupemail") {
            setSignUpEmail(e.target.value);
        } else if (e.target.id === "signuppassword") {
            setSignUpPassword(e.target.value);
        } else if (e.target.id === "signupconfirmpassword") {
            setSignUpCofirmPassword(e.target.value);
        }
      }

    return (
        <div className="signupbody">
            <h1 className="instagramtitle">INSTAGRAM</h1>
            <div className="signupcontainer">
                <div className="signinleft">
                    <h2 className="signintitle">SIGN IN</h2>
                    <p className="signindesc">Welcome back!</p>
                    <label className="signlabel" >EMAILL ADDRESS</label>
                    <input className="signininput" id="signinemail" type="email"  name="signinemail" onChange={handleChange}></input>
                    <label className="signlabel" >PASSWORD</label>
                    <input className="signininput" id="signinpassword" type="password"  name="signinpassword" onChange={handleChange}></input>
                    <button className="signinbutton">Sign In</button>
                    <p className="forgotpassword">Forgot Password?</p>
                    <p className="errormessage">error message</p>
                </div>
                <div className="signupright">
                    <h2 className="signuptitle">NEW HERE?</h2>
                    <p className="signupdesc">Create an account here.</p>
                    <label className="signlabel" >EMAILL ADDRESS</label>
                    <input className="signupinput" id="signupemail" type="email"  name="signupemail" onChange={handleChange}></input>
                    <label className="signlabel" >PASSWORD</label>
                    <input className="signupinput" id="signuppassword" type="password"  name="signinpassword" onChange={handleChange}></input>
                    <label className="signlabel" >CONFIRM PASSWORD</label>
                    <input className="signupinput" id="signupconfirmpassword" type="password"  name="signinpassword" onChange={handleChange}></input>
                    <button className="signupbutton">Sign Up</button>
                </div>
            </div>
        </div>
    )
}

export default Signup;