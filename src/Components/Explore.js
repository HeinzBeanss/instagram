import React, { useEffect, useState } from "react";
import "../CSS/Explore.css"
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
    const [posts, setPosts] = useState([]);
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

            const fetchPosts = async () => {
                let temparray = [];
                const querySnapshot = await getDocs(collection(db, "posts"));
                console.log("FETCHING POSTS");
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
                    // console.log(doc.data());
                    setPosts(temparray);
                    // setUsers(users => [...users, doc.data()])
                })
            }

            fetchUsers()
            .catch(console.error);
            fetchPosts()
            .catch(console.error);
            setShouldIFetchData(false);
        }
    }, [shouldIFetchData]);

    const followUser = async (user) => {
        console.log(users)
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
                console.log("WRITING DATA - updating following for current user");
                tempUserData.following.push(user.uid);
                const currentuserDocRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(currentuserDocRef, {
                    "following": tempUserData.following,
                })

                console.log("WRITING DATA - updating followers for target user");
                let temptargetuserfollowers = user.followers;
                temptargetuserfollowers.push(auth.currentUser.uid);
                const targetuserDocRef = doc(db, "users", user.uid);
                await updateDoc(targetuserDocRef, {
                    "followers": temptargetuserfollowers,
                })
                setShouldIFetchData(true);
            }
        }
    }

    const [value, setValue] = useState("");

    const onChange = (e) => {
        setValue(e.target.value);
    }

    const onSearch = (searchTerm) => {
        console.log("search ", searchTerm)
    }


    // const hoveringOverImage = () => {
    //     setShowHover({});
    //     console.log(showHover);
    // }

    // const hoveringOffImage = () => {
    //     console.log("tes11");
    //     setShowHover({display: "none"});
    //     console.log(showHover);
    // }

    // onMouseOver={hoveringOverImage} onMouseLeave={hoveringOffImage}

    const [showHover, setShowHover] = useState({display: "none"})
    return (
        <div className="explorepage">
            <div className="explorepagecontent">
            <div className="searchcontainer">
                <div className="searchcontainerinner">
                    <input className="searchbar" placeholder="Search users..." value={value} onChange={onChange}></input>
                    <button className="searchbutton" onClick={() => onSearch(value)}>Search</button>
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
            
            {/* <div className="exploreusergrid">
            {users.map((index, i) => {
            return (
                <div className="exploreusercard" key={i}>
                    <img className="exploreuserimage" src={index.photoURL} alt="user"></img>
                    <div className="exploreuserrightside">
                        <div>
                        <Link className="exploreusername" to={`/user/${index.uid}`} state={{ 
                            displayName: index.displayName,
                            followers: index.followers,
                            following: index.following, 
                            photoURL: index.photoURL,
                            uid: index.uid,
                            description: index.description,
                         }}><div>{index.displayName}</div></Link>
                         <div className="exploreuserdesc">{index.description}</div>
                         </div>
                         
                         <div className="exploreuserrightsidebot">
                         <div className="explorefollowinginfo">
                            <div>{index.followers.length} followers</div>
                            <div>{index.following.length} following</div>
                         </div>
                        <button className="explorefollowbutton" onClick={ () => followUser(index)}>Follow</button>
                        </div>
                    </div>
                </div>
                )
            })}
            </div> */}

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