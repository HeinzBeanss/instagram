import React, { useEffect, useState } from "react";

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

    useEffect(() => {

            const fetchUsers = async () => {
                let temparray = [];
                const querySnapshot = await getDocs(collection(db, "users"));
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
    }, [tempUserData])

    const followUser = async (user) => {
        console.log(tempUserData.following);
        console.log("abnove this")
        if (tempUserData.following.includes(user.uid)) {
            //
        } else {
            const currentuserDocRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(currentuserDocRef, {
                "following": tempUserData.following,
            })
        }
        // const tempstringuid = user.uid.toString();
        // console.log(tempstringuid);
        // let newTempUserDate = tempUserData.following.push(tempstringuid);
        // console.log(newTempUserDate);
        tempUserData.following.push(user.uid);
        // console.log(auth.currentUser.uid);
        
        // console.log(users);
        // console.log(user);
    }

    return (
        <div>{users.map((index, i) => {
            return (
                <div key={i}>
                    <div>{index.uid}</div>
                    <div>{index.displayName}</div>
                    <button onClick={ () => followUser(index)}>Follow</button>
                </div>
            )
        })}</div>
        )
}

export default Explore;