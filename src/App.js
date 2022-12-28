import './CSS/App.css';
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import Nav from "./Components/Nav";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import Signup from "./Components/Signup";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword ,signInWithEmailAndPassword } from "firebase/auth";

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


function App() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const createUserFunction = () => {
    // console.log(`${email} and ${password}`);
    console.log(auth);
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      // ...
      console.log(userCredential);
      console.log(user);
      console.log("YOU SHOULD NOW BE SIGNED IN.")
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      console.log(errorCode);
      console.log(errorMessage);
    });

  }

  const handleChange = (e) => {

    if (e.target.className === "email") {
      setEmail(e.target.value);
    } else if (e.target.className === "password") {
      setPassword(e.target.value);
    }

  }
  

  // get user
  // const getuserinfo = () => {
  // maybe give it to another variable using useState, aka isLoggedIn, setIsLoggedIn
  onAuthStateChanged(auth, (user) => {
    if (!user) {
    console.log("user is signed out");
    setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
      const uid = user.uid;
      console.log("user is signed in");
      
    }
  });
// }
 //

 if (isLoggedIn) {
  return (
    <BrowserRouter >
    {/* ADD basename={process.env.PUBLIC_URL} to the BrowserRouter element when deploying! */}
        {/* <Nav /> */}

        <div className="signin"> Sign in here:
            <input type="text" className="email" onChange={handleChange}></input>
            <input type="password" className="password" onChange={handleChange}></input>     
            <button className='createuser' onClick={createUserFunction}>Create Account</button>   
            <Link to={"/profile"}><button className='testbutton'>CLICK ME TO MOVE TO ANOTHER PAGE</button></Link>
        </div>
        
        <Routes>
            <Route path={"/sign-up"} />
            <Route path={"/"} element={<Home />} />
            <Route path={"/profile"} element={ <Profile /> } />
            
        </Routes>
        
    </BrowserRouter>
    )
 } else {
  return (
    < Signup />
    // use component here, app page, or maybe figure uot how to just go to a new url in general. which then uses a button to go to this page again! once signed in.
    // just retyurn the new sign in page component, which then links back to this page with a LINK tag.
  )
 }

}

export default App;
