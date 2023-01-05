import React, { useEffect, useState, } from "react";
import { useFetcher, useLocation } from 'react-router-dom'

import "../CSS/User.css"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
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
  getDocs,
  where
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';

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

const User = () => {

    // get posts only with the same uid like i did on profile page.
    const [singleUserPosts, setSingleUserPosts] = useState([]);

    const location = useLocation()
    console.log(location);
    console.log("above is location, which shuold be user.");

    useEffect(() => {
        console.log("one time effect, getting single user posts")

        const fetchJustUserPosts = async () => {
            let tempuserpostarray = [];
            const q = query(collection(db, "posts"), where("useruid", "==", location.state.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              tempuserpostarray.unshift(doc.data());
            });
            setSingleUserPosts(tempuserpostarray);
          }
      
          fetchJustUserPosts();
    }, [])

    return (
        <div className="usercontainer">
          <div className="usercontent">
            <div className="usertopsection">
              <img className="useruserimage" src={location.state.photoURL} alt="user's profile"></img>
                <div className="usertopsectionright">
                  <div className="usertopsectionrighttop">
                    <h2 className="userusername">{location.state.displayName}</h2>
                  </div>

                  <div className="usertopsectionrightmid">
                    <div>Followers: {location.state.followers.length}</div>
                    <div>Following: {location.state.following.length}</div>
                  </div>

                  <div className="usertopsectionrightbot">
                    <div className="userdesc">{location.state.description}</div>  
                  </div>
              </div>
            </div>
          
            <div className="userarea">
              {singleUserPosts.map((post, index) => {
                return (
                  <img className="userimage" key={index} src={post.imageUrl} alt="user post"></img>
                )
              })}
            </div>
          </div>
        </div>
    )
}

export default User;