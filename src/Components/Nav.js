import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/Nav.css"
import CreatePost from "./CreatePost";

const Nav = (props) => {

    return (
        <div className="sidebarbody">
            
            <div className="topsection">
                <div className="logosection">
                    {/* <img src="."></img> */}
                    <Link className="logotitle" to={"/"}><h1 className="logotitle">Instagram</h1></Link>
                </div>
                <div className="createpostbutton" onClick={ () => props.setCreatePost(<CreatePost setCreatePost={props.setCreatePost}/>)}>Create</div>
                <Link className="profiletitle" to={"/profile"}><h2 className="profiletitle">Profile</h2></Link>
                <Link className="searchtitle" to={"/explore"}><h2>Explore</h2></Link>
            </div> 
            <div className="bottomsection">
                <div className="settings">Settings</div>
            </div>

            
        </div>
        
    )
}

export default Nav;