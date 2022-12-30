import React from "react";
import "../CSS/Home.css"
const Home = (props) => {
    console.log("testing home")

    return (
        <div className="newsfeedbody">
            {/* {props.createPost} */}
            <div className="newsfeed"></div>
        </div>
    )
}

export default Home;