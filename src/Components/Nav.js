import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/Nav.css"
import CreatePost from "./CreatePost";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signOut } from "firebase/auth";

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

const Nav = (props) => {

    const signout = () => {
        console.log("signing out");
        auth.signOut().then(() => {
            console.log("user logged out");
        })

    }

    return (
        <div className="sidebarbody">
            
            <div className="topsection">
                <div className="logosection">
                    {/* <img src="."></img> */}
                    <Link className="logotitle" to={"/"}><h1 className="logotitle">Instagram</h1></Link>
                </div>
                <div className="usersection">
                    <img className="navprofilepicture" src={getAuth().currentUser.photoURL} alt="user's profile"></img>
                    <h2 className="navusername">{getAuth().currentUser.displayName}</h2>
                </div>
                <div className="createpostbutton" onClick={ () => props.setCreatePost(<CreatePost setCreatePost={props.setCreatePost}/>)}>Create</div>
                <Link className="profiletitle" to={"/profile"}><h2 className="profiletitle">Profile</h2></Link>
                <Link className="searchtitle" to={"/explore"}><h2>Explore</h2></Link>
            </div> 
            <div className="bottomsection">
                <div className="settings">Settings</div>
                <div className="signoutbutton" onClick={signout}>Sign out</div>
            </div>

            
        </div>
        
    )
}

export default Nav;