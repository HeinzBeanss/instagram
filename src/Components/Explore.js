import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword ,signInWithEmailAndPassword } from "firebase/auth";
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
    getDocs
  } from 'firebase/firestore';
import { async } from "@firebase/util";

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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);


const Explore = () => {

    const [users, setUsers] = useState([]);
    const [tempUserData, setTempUserData] = useState();
    const [shouldIFetchData, setShouldIFetchData] = useState(true);

    useEffect(() => {
        console.log(shouldIFetchData);
        if (shouldIFetchData === true) {
            const fetchUsers = async () => {
                let temparray = [];
                const querySnapshot = await getDocs(collection(db, "users"));
                console.log("FETCHING DATA");
                querySnapshot.forEach((doc) => {
                    if (temparray.includes(doc.data())) {
                        // do nothing
                    } else {
                        temparray.unshift(doc.data());
                    }
                    // console.log(doc.data());
                    setUsers(temparray);
                    // setUsers(users => [...users, doc.data()])
                    if (doc.data().uid === auth.currentUser.uid) {
                        // console.log("same user under me.")
                        // console.log(auth.currentUser.uid);
                        setTempUserData(doc.data());
                    }
                });
            }   
            fetchUsers()
            .catch(console.error);
            setShouldIFetchData(false);
        }
    }, [shouldIFetchData]);

    const followUser = async (user) => {
        console.log(tempUserData.following);
        console.log("abnove this");
        console.log(user.uid);
        console.log(auth.currentUser.uid);
        if (user.uid === auth.currentUser.uid) {
            console.log("you can't follow yourself!")
        } else {
            if (tempUserData.following.includes(user.uid)) {
                //
                console.log("it isn't working!")
            } else {
                console.log("WRITING DATA")
                tempUserData.following.push(user.uid);
                const currentuserDocRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(currentuserDocRef, {
                    "following": tempUserData.following,
                })
                setShouldIFetchData(true);
            }
        }
    }

    return (
        <div>{users.map((index, i) => {
            return (
                <div key={i}>
                    <div>{index.uid}</div>
                    <Link to={`/user/${index.uid}`} state={{ 
                        displayName: index.displayName,
                        followers: index.followers,
                        following: index.following, 
                        photoURL: index.photoURL,
                        uid: index.uid,
                        description: index.description,
                     }}><div>{index.displayName}</div></Link>
                     <div>{index.description}</div>
                    <button onClick={ () => followUser(index)}>Follow</button>
                </div>
            )
        })}</div>
        )
}

export default Explore;