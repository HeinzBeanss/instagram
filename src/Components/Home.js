import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../CSS/Home.css"

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

const Home = (props) => {
    console.log("testing home")

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [followedUsers, setFollowedUsers] = useState([]);
    const [tempUserData, setTempUserData] = useState();
    const [shouldIFetchData, setShouldIFetchData] = useState(true);

    useEffect(() => {
        console.log("USING EFFECT HERE!");
        console.log(tempUserData);
        if (shouldIFetchData === true) {

            const fetchUsers = async () => {
                let tempuserarray = [];
                let tempfollowedusersarray = [];
                const querySnapshot = await getDocs(collection(db, "users"));
                console.log("FETCHING USERS");
                querySnapshot.forEach((doc) => {
                    if (tempuserarray.includes(doc.data())) {
                        // do nothing
                    } else {
                        // adds to the beginning of the array
                        tempuserarray.unshift(doc.data());
                    }
                    setUsers(tempuserarray);

                    if (doc.data().uid === auth.currentUser.uid) {
                        // console.log("same user under me.")
                        // console.log(auth.currentUser.uid);
                        setTempUserData(doc.data());
                    }



                    
                });
            }   

            const fetchPosts = async () => {
                let temppostsarray = [];
                const q = query(collection(db, "posts"), orderBy("timestamp"), limit(10));
                const querySnapshot = await getDocs(q);
                console.log("FETCHING POSTS");
                querySnapshot.forEach((doc) => {
                    if (temppostsarray.includes(doc.data())) {
                        // do nothing
                    } else {
                        // adds to the beginning of the array
                        temppostsarray.unshift(doc.data());
                    }
                    setPosts(temppostsarray);
                });
            } 

            fetchUsers()
            .catch(console.error);
            fetchPosts()
            .catch(console.error);
            setShouldIFetchData(false);
        }
    }, [shouldIFetchData]);

    return (
        <div className="newsfeedbody">
            <div className="newsfeed">
                {posts.map((post, index) => {
                    let profilepic = getAuth().currentUser.photoURL;
                    let date = post.timestamp.toDate();
                    let dateString = date.toDateString();
                    // verifies that none of the current user's posts are shown
                    if (post.useruid !== getAuth().currentUser.uid) {
                        // verifies that the post
                        if (!tempUserData.following.includes(post.useruid))
                        {
                            return (
                                <div key={index}></div>
                            )
                        } else {
                            return (
                                <div className="post" key={index}>
                                    <h2 className="postusername">{post.name}</h2>
                                    <img className="postimage" src={`${post.imageUrl}`} alt="uploaded by user"></img>
                                    <div className="postcaption">{post.caption}</div>
                                    <div className="postdateposted">Posted at {dateString}</div>
                                    <div className="postcommentarea">
                                        <img src={profilepic} alt="default profile"></img>
                                        <div className="commentcurrentuser">{getAuth().currentUser.displayName}</div>
                                        <input className="commentinput" type={"text"} placeholder="Add a comment..."></input>
                                        {post.comments.map((comment, index) => {
                                            return (
                                                <div className="commentcomment">{comment}</div>
                                            )
                                        })}
                                    </div>
                                    <div className="likearea">
                                        <button className="likebutton">Like</button>
                                        <div className="likes">{post.likes}</div>
                                    </div>
                                    
                                </div>
                                )
                        }
                    } 
                    else {
                        return (
                            <div key={index}></div>
                        )
                    }
                })}
            </div>
        </div>
    )
}

export default Home;

    // const followUser = async (user) => {
    //     console.log(tempUserData.following);
    //     console.log("abnove this");
    //     console.log(user.uid);
    //     console.log(auth.currentUser.uid);
    //     if (user.uid === auth.currentUser.uid) {
    //         console.log("you can't follow yourself!")
    //     } else {
    //         if (tempUserData.following.includes(user.uid)) {
    //             //
    //             console.log("it isn't working!")
    //         } else {
    //             console.log("WRITING DATA")
    //             tempUserData.following.push(user.uid);
    //             const currentuserDocRef = doc(db, "users", auth.currentUser.uid);
    //             await updateDoc(currentuserDocRef, {
    //                 "following": tempUserData.following,
    //             })
    //             setShouldIFetchData(true);
    //         }
    //     }
    // }