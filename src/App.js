import './CSS/App.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

// import Nav from "./Components/Nav";
import Loading from "./Components/Loading";
import CreatePost from './Components/CreatePost';
import Nav from "./Components/Nav";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import Signup from "./Components/Signup";
import Explore from "./Components/Explore";

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

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // The Create Post Component
  const [createPost, setCreatePost] = useState([]);
  
  // Check if user is logged in.
  useEffect(() => {
    console.log("FETCHING DATA IFUSER IS SIGNED IN");
    onAuthStateChanged(auth, (user) => {
      if (!user) {
      console.log("user is signed out");
      setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
        const uid = user.uid;
        console.log("user is signed in");
        console.log(user.uid);
        console.log(user.displayName);
        console.log(`user display name: ${user.displayName}`);

        console.log("below his!");
        console.log(auth);
        console.log(auth.user);
        
      }
    });
  }, [])
 
 if (isLoggedIn) {
  return (
    <BrowserRouter >
    {createPost}
    {/* ADD basename={process.env.PUBLIC_URL} to the BrowserRouter element when deploying! */}
        <Nav setCreatePost={setCreatePost}/>
        
        <Routes>
            <Route path={"/sign-up"} />
            <Route path={"/"} element={<Home createPost={createPost}/>} />
            <Route path={"/profile"} element={ <Profile /> } />
            <Route path={"/explore"} element={ <Explore /> } />
        </Routes>
    </BrowserRouter>
    )
 } else if (!isLoggedIn) {
  return (
    < Signup />
  )
 } 

}

export default App;
