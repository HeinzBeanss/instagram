import './CSS/App.css';
import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Nav from "./Components/Nav";
import Home from "./Components/Home"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword ,signInWithEmailAndPassword } from "firebase/auth";

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

  // const handleChangeEmail = (e) => {
  //   console.log(e.target);
  // }  

  // const handleChangePassword = (e) => {
    
  // }
  
  return (
    <BrowserRouter >
    {/* ADD basename={process.env.PUBLIC_URL} to the BrowserRouter element when deploying! */}
        {/* <Nav /> */}

        <div className="signin"> Sign in here:
            <input type="text" className="email" onChange={handleChange}></input>
            <input type="password" className="password" onChange={handleChange}></input>     
            <button className='createuser' onClick={createUserFunction}>Create Account</button>   
        </div>
        
        <Routes>
            
            <Route path={"/home"} element={<Home />} />
            {/* <Route path={"/profile}"} element={ } /> */}
            
        </Routes>
        
    </BrowserRouter>
    )
}

export default App;
