import React, { useEffect, useState } from "react";
import "../CSS/Signup.css"
import Home from "./Home";

// import { Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    orderBy,
    limit,
    onSnapshot,
    setDoc,
    updateDoc,
    doc,
    serverTimestamp,
  } from 'firebase/firestore';

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
  const db = getFirestore(app);


const Signup = () => {

    const [signInEmail, setSignInEmail] = useState("");
    const [signInPassword, setSignInPassword] = useState("");
    const [signUpUsername, setSignUpUsername] = useState("");
    const [signUpEmail, setSignUpEmail] = useState("");
    const [signUpPassword, setSignUpPassword] = useState("");
    const [signUpConfirmPassword, setSignUpCofirmPassword] = useState("");

    const [signInError, setSignInError] = useState(<div className="signinerrormessage" style={{visibility: "hidden"}}></div>);
    const [signUpError, setSignUpError] = useState(<div className="signuperrormessage" style={{visibility: "hidden"}}></div>);
    
    // Shows Password not matching error, also removes error after updating email.
    useEffect(() => {
        console.log("REFRESHING PASSOWRD BOXES");
        if (signUpConfirmPassword === signUpPassword) {
            setSignUpError(<div className="signuperrormessage" style={{visibility: "hidden"}}>Error: Passwords do not match!</div>)
        } else if (signUpConfirmPassword !== signUpPassword) {
            setSignUpError(<div className="signuperrormessage">Error: Passwords do not match!</div>)
        } 
    }, [signUpPassword, signUpConfirmPassword, signUpEmail]);

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
        } else if (e.target.id === "signupusername") {
            setSignUpUsername(e.target.value);
        }
      }

    const signIn = () => {
        console.log("ATTEMPTING SIGNING IN");
        signInWithEmailAndPassword(auth, signInEmail, signInPassword)
        .then((userCredential) => {
            console.log("ATTEMPTING SIGNING IN X2");
            // Signed in 
            // userCredential.user.displayName = signUpUsername;
            const user = userCredential.user;
            // ...
            
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log("incorrect login details");
            console.log(errorCode);
            console.log(errorMessage);
            setSignInError(<div className="signinerrormessage">Error: {errorCode}</div>)
        });
        // const auth = getAuth();

    }

    const signUp = async () => {
        console.log("SIGNING UP");
        console.log(`THIS IS THE CURRENT SIGNUPUSERNAME: ${signUpUsername}`);
        if (signUpPassword === signUpConfirmPassword) {
            console.log(auth);
            createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                // ...
                console.log(userCredential);
                console.log(user);
                // ..

                updateProfile(auth.currentUser, {
                    displayName: signUpUsername, 
                    photoURL: "https://firebasestorage.googleapis.com/v0/b/instagram-ed084.appspot.com/o/default-profile-picture.png?alt=media&token=46359339-51c1-43b6-8a15-c79ca3981d21",
                  }).then(() => {
                    console.log("profile updated!")
                    console.log(auth.currentUser.displayName);
                    // Profile updated!
                    // ...
                  }).catch((error) => {
                    // An error occurred
                    // ...
                  });

                  try {
                    console.log("generating user");
                    const docRef = setDoc(doc(db, "users", auth.currentUser.uid), {
                      displayName: signUpUsername,
                      photoURL: "https://firebasestorage.googleapis.com/v0/b/instagram-ed084.appspot.com/o/default-profile-picture.png?alt=media&token=46359339-51c1-43b6-8a15-c79ca3981d21",
                      description: "",
                      uid: auth.currentUser.uid,
                      followers: [],
                      following: [],
                      likedposts: [],
                    });
                    console.log("User Added to Firestore Database");
                    console.log("Document written with ID: ", docRef.id);
                  } catch (e) {
                    console.error("Error adding document: ", e);
                  }
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              // ..
              console.log(error);
              console.log(errorCode);
              console.log(errorMessage);
              setSignUpError(<div className="signuperrormessage">Error: {errorCode}</div>)

            });
            //
        } else {
            console.log("passwords dont match")
            
        }
    }

    return (
        <div className="signupbody">
            <h1 className="instagramtitle">INSTAGRAM</h1>
            <div className="signupcontainer">
                <div className="signinleft">
                    <h2 className="signintitle">SIGN IN</h2>
                    <p className="signindesc">Welcome back!</p>
                    <label className="signlabel" >EMAIL ADDRESS</label>
                    <input className="signininput" id="signinemail" type="email"  name="signinemail" onChange={handleChange}></input>
                    <label className="signlabel" >PASSWORD</label>
                    <input className="signininput" id="signinpassword" type="password"  name="signinpassword" onChange={handleChange}></input>
                    <button className="signinbutton" onClick={signIn}>Sign In</button>
                    <p className="forgotpassword">Forgot Password?</p>
                    {signInError}
                </div>
                <div className="signupright">
                    <h2 className="signuptitle">NEW HERE?</h2>
                    <p className="signupdesc">Create an account here.</p>
                    <label className="signlabel" >USERNAME</label>
                    <input className="signupinput" id="signupusername" type="text"  name="signupusername" onChange={handleChange}></input>
                    <label className="signlabel" >EMAIL ADDRESS</label>
                    <input className="signupinput" id="signupemail" type="email"  name="signupemail" onChange={handleChange}></input>
                    <label className="signlabel" >PASSWORD</label>
                    <input className="signupinput" id="signuppassword" type="password"  name="signinpassword" onChange={handleChange}></input>
                    <label className="signlabel" >CONFIRM PASSWORD</label>
                    <input className="signupinput" id="signupconfirmpassword" type="password"  name="signinpassword" onChange={handleChange}></input>
                    <button className="signupbutton" onClick={signUp}>Sign Up</button>
                    {signUpError}
                </div>
            </div>
        </div>
    )
}

export default Signup;