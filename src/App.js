import './CSS/App.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";

import sun from "./Assets/sun.svg";
import moon from "./Assets/moon.svg";

// import Nav from "./Components/Nav";
import Nav from "./Components/Nav";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import Signup from "./Components/Signup";
import Explore from "./Components/Explore";
import User from "./Components/User";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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
let auth = getAuth(app);



function App() {

  // DARK/LIGHT THEME 
  const [theme, setTheme] = useState("light");
  const [themesvg, setThemesvg] = useState(sun);
  const toggleTheme = () => {
      if (theme === 'light') {
        setTheme('dark');
        setThemesvg(moon);
      } else {
        setTheme('light');
        setThemesvg(sun);
      }
    };
    useEffect(() => {
      document.body.className = theme;
    }, [theme])

  // FOR NAV
  const [shouldIUpdateNav, setShouldIUpdateNav] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // The Create Post Component
  const [createPost, setCreatePost] = useState([]);
  
  // Check if user is logged in.
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
      setIsLoggedIn(false);
      } else {
        auth = getAuth();
        setIsLoggedIn(true);
        setShouldIUpdateNav(true)
      }
    });
  }, [])
 
 if (isLoggedIn) {
  return (

    // <BrowserRouter basename={process.env.PUBLIC_URL}>
    <HashRouter>
    {createPost}
    {/* ADD basename={process.env.PUBLIC_URL} to the BrowserRouter element when deploying! */}
        <Nav setCreatePost={setCreatePost} shouldIUpdateNav={shouldIUpdateNav} setShouldIUpdateNav={setShouldIUpdateNav} toggleTheme={toggleTheme} themesvg={themesvg}/>
        
        <Routes>
            <Route path={"/sign-up"} />
            <Route path={"/"} element={<Home createPost={createPost}/>} />
            <Route path={"/profile"} element={ <Profile shouldIUpdateNav={shouldIUpdateNav} setShouldIUpdateNav={setShouldIUpdateNav}/> } />
            <Route path={"/explore"} element={ <Explore /> } />
            <Route path={"/user/:useruid"} element={ <User />} />
        </Routes>
    </HashRouter>
    )
 } else if (!isLoggedIn) {
  return (
    < Signup />
  )
 } 

}

export default App;
