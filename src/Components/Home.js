import React, { useEffect, useState, useRef} from "react";
import { Link } from "react-router-dom";
import "../CSS/Home.css"
import heartsvg from "../Assets/heart.svg";
import smilesvg from "../Assets/smile.svg";

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
    getDocs,
    where
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

    const inputRef = useRef(null);
    const [updateComment, setUpdateComment] = useState(false);



    useEffect(() => {
        if (updateComment === true) {
            console.log("comment has been updated fam!");
            console.log(tempUserData);
            setFullComment({
            username: tempUserData.displayName,
            useruid: tempUserData.uid,
            photoURL: tempUserData.photoURL,
            commenttext: commenttext,
            // could do time but .. maybe later
        })
        }
        setUpdateComment(false);
    }, [updateComment])

    const [increaseLike, setIncreaseLike] = useState(false);

    useEffect(() => {

        if (increaseLike === true) {
            setIncreaseLike(false);            
            // setShouldIFetchData(true);
        }
    }, [increaseLike])

    const [commenttext, setCommenttext] = useState();
    const [fullComment, setFullComment] = useState({});
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
                const q = query(collection(db, "posts"), orderBy("timestamp"), limit(25));
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

    const postComment = async (post) => {
        let tempcomments = post.comments;
        completeComment();
        tempcomments.push(fullComment);
        console.log(posts);
        console.log(post.postid)
        const postRef = collection(db, "posts");
        await updateDoc(doc(postRef, post.postid), {
            comments: tempcomments,
        });
        console.log("comment posted")
        inputRef.current.value = "";
        setShouldIFetchData(true);
    }

    const handleChange = (e) => {
        setCommenttext(e.target.value);
        console.log(commenttext);
        setUpdateComment(true);
    }

    const completeComment = () => {
        console.log("setting comments");
        
    }

    const likePost = async (post) => {
            // unlike if it's already liked
            if (post.likes.includes(tempUserData.uid)) {

                let templikes = post.likes;
                const index = templikes.indexOf(post.useruid);
                templikes.splice(index, 1);
                const postRef = collection(db, "posts");
                await updateDoc(doc(postRef, post.postid), {
                    likes: templikes,
                });
    
    
                let templikedposts = tempUserData.likedposts;
                const index2 = templikedposts.indexOf(post.postid);
                templikedposts.splice(index2, 1);
                const currentUserRef = collection(db, "users");
                await updateDoc(doc(currentUserRef, auth.currentUser.uid), {
                    likedposts: templikedposts
                })
                console.log("Liked: 1) added likedusers to post 2) added likedposts to user");
                setShouldIFetchData(true);

            } else {
                // like it
                let templikes = post.likes;
                templikes.push(tempUserData.uid);
                const postRef = collection(db, "posts");
                await updateDoc(doc(postRef, post.postid), {
                    likes: templikes,
                });
    
    
                let templikedposts = tempUserData.likedposts;
                templikedposts.push(post.postid);
                const currentUserRef = collection(db, "users");
                await updateDoc(doc(currentUserRef, auth.currentUser.uid), {
                    likedposts: templikedposts
                })
                console.log("Liked: 1) added likedusers to post 2) added likedposts to user");
                setShouldIFetchData(true);
            }   
    }

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
                                    <div className="posttoparea">
                                        <img className="postuserpic" src={`${post.profilePicUrl}`} alt="user profile"></img>
                                        {users.filter(user => {
                                            return user.uid === post.useruid;
                                        })
                                        .map((user) => {
                                            return (
                                                <Link key={user.uid} className="exploreusername" to={`/user/${user.uid}`} state={{ 
                                                    displayName: user.displayName,
                                                    followers: user.followers,
                                                    following: user.following, 
                                                    photoURL: user.photoURL,
                                                    uid: user.uid,
                                                    description: user.description,
                                                 }}><div>{user.displayName}</div></Link>
                                            )
                                        })}
                                        {/* <h2 className="postusername">{post.name}</h2> */}
                                    </div>
                                    <img className="postimage" src={`${post.imageUrl}`} alt="uploaded by user"></img>
                                    <div className="likeanddatearea">
                                        <div className="likearea">
                                            <img src={heartsvg} alt="like" className="likebutton" onClick={() => likePost(post)}></img>
                                            <div className="likes">{post.likes.length} likes</div>
                                        </div>
                                        <div className="postdateposted">Posted at {dateString}</div>
                                    </div>
                                    
                                    <div className="postdescarea">
                                        <div className="postdescusername">{post.name}</div>
                                        <div className="postcaption">{post.caption}</div>
                                    </div>

                                    <div className="postcomments">
                                        {post.comments.map((comment, index) => {
                                                return (
                                                    <div className="acomment">
                                                        {/* <div className="userofcomment">{comment.username}</div> */}
                                                        {users.filter(user => {
                                                                return user.uid === comment.useruid;
                                                            })
                                                            .map((user) => {
                                                                return (
                                                                    <Link key={user.uid} className="userofcomment" to={`/user/${user.uid}`} state={{ 
                                                                        displayName: user.displayName,
                                                                        followers: user.followers,
                                                                        following: user.following, 
                                                                        photoURL: user.photoURL,
                                                                        uid: user.uid,
                                                                        description: user.description,
                                                                     }}><div>{user.displayName}</div></Link>
                                                                )
                                                            })}
                                                        <div key={index} className="commentcomment">{comment.commenttext}</div>
                                                    </div>
                                                    
                                                )
                                            })}
                                    </div>

                                    <div className="postcommentinputarea">
                                        <img src={smilesvg} alt="smiley face" className="commentsmile"></img>
                                            <div className="commentinput">
                                            <input ref={inputRef} className="commentinputbox" type={"text"} placeholder="Add a comment..." onChange={handleChange}></input>
                                            <button className="confirmcomment" onClick={() => postComment(post)}>Post</button>
                                            </div>
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