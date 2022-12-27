import React from "react";
import "../CSS/Nav.css"

const Nav = () => {

    return (
        <div className="signin"> Sign in here:
            <input type="number" className="email"></input>
            <input type="password" className="password"></input>        
        </div>
        
    )
}

export default Nav;