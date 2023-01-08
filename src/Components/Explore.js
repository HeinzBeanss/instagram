import React, { useEffect, useState } from "react";
import "../CSS/Explore.css"
import { Link } from "react-router-dom";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {
    getFirestore,
    collection,
    getDocs
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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);


const Explore = () => {

    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [tempUserData, setTempUserData] = useState();
    const [shouldIFetchData, setShouldIFetchData] = useState(true);

    useEffect(() => {
        if (shouldIFetchData === true) {
            const fetchUsers = async () => {
                let temparray = [];
                const querySnapshot = await getDocs(collection(db, "users"));
                querySnapshot.forEach((doc) => {
                    if (temparray.includes(doc.data())) {
                        // 
                    } else {
                        temparray.unshift(doc.data());
                    }
                    setUsers(temparray);
                    if (doc.data().uid === auth.currentUser.uid) {
                        setTempUserData(doc.data());
                    }
                });
            }   

            const fetchPosts = async () => {
                let temparray = [];
                const querySnapshot = await getDocs(collection(db, "posts"));
                querySnapshot.forEach((doc) => {
                    if (temparray.includes(doc.data())) {
                        // do nothing
                    } else {
                        if (doc.data().useruid === auth.currentUser.uid) {
                            // do nothing
                        } else {
                            temparray.unshift(doc.data());
                        }
                        
                    }
                    setPosts(temparray);
                })
            }

            fetchUsers()
            .catch(console.error);
            fetchPosts()
            .catch(console.error);
            setShouldIFetchData(false);
        }
    }, [shouldIFetchData]);

    const [value, setValue] = useState("");

    const onChange = (e) => {
        setValue(e.target.value);
    }

    return (
        <div className="explorepage">
            <div className="explorepagecontent">
            <div className="searchcontainer">
                <div className="searchcontainerinner">
                    <input className="searchbar" placeholder="Search users..." value={value} onChange={onChange}></input>
                </div>
                <div className="dropdown">
                    {users.filter(user => {
                        const searchTerm = value.toLowerCase();
                        const usersName = user.displayName.toLowerCase();

                        return searchTerm && usersName.startsWith(searchTerm)
                    })
                    .map((user) => ( 
                        <Link className="dropdown-row" key={user.uid} to={`/user/${user.uid}`} state={{ 
                            displayName: user.displayName,
                            followers: user.followers,
                            following: user.following, 
                            photoURL: user.photoURL,
                            uid: user.uid,
                            description: user.description,
                         }}>{user.displayName}</Link>
                    ))}
                </div>
            </div>
            
            <h2 className="exploretitle">Posts we think you'll like</h2>

            <div className="exploreusergrid">
                {posts.filter(post => {
                    return !tempUserData.following.includes(post.useruid)
                })
                .map((post, index) => {
                    return (
                            <Link  key={post.postid} className="exploreimage" to={`/user/${post.useruid}`} state={{ 
                            uid: post.useruid,
                            }} >
                            <img className="exploreimageimage" src={post.imageUrl} alt="user post" ></img>
                            
                            
                         </Link>
                    )
                })}
            </div>
            </div>
        </div>
        )
}

export default Explore;