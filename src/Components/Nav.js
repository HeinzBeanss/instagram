import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/Nav.css"
import CreatePost from "./CreatePost";

const Nav = (props) => {
    console.log("testing nav")
    console.log(props.setCreatePost)
    console.log(props)    // const [showCreatePost, setShowCreatePost] = useState(false);
    


    return (
        <div className="sidebarbody">
            
            <div className="topsection">
                <div className="logosection">
                    {/* <img src="."></img> */}
                    <Link className="logotitle" to={"/"}><h1 className="logotitle">Instagram</h1></Link>
                </div>
                <div className="createpostbutton" onClick={ () => props.setCreatePost(<CreatePost />)}>Create</div>
                <Link className="profiletitle" to={"/profile"}><h2 className="profiletitle">Profile</h2></Link>
            </div> 
            <div className="bottomsection">
                <div className="settings">Settings</div>
            </div>

            
        </div>
        
    )
}

export default Nav;