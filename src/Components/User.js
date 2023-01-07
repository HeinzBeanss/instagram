import React, { useEffect, useState } from "react";
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
    let [singleUser, setSingleUser] = useState({});
    let [currentUser, setCurrentUser] = useState({});
    const [singleUserPosts, setSingleUserPosts] = useState([]);
    const [shouldIFetchData, setShouldIFetchData] = useState(true);

    
    const [profilefollowers, setProfilefollowers] = useState([]);
    const [profilefollowing, setProfilefollowing] = useState([]);

    const location = useLocation();

    useEffect(() => {
        console.log("one time effect, getting single user posts")
        if (shouldIFetchData === true) {

          const fetchJustUserPosts = async () => {
            let tempuserpostarray = [];
            const q = query(collection(db, "posts"), where("useruid", "==", location.state.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              tempuserpostarray.unshift(doc.data());
            });
            setSingleUserPosts(tempuserpostarray);
          }

          const fetchJustUser = async () => {
            // let tempuserarray = [];
            const q = query(collection(db, "users"), where("uid", "==", location.state.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              // tempuserarray.unshift(doc.data());
              console.log(doc.data());
              setProfilefollowers(doc.data().followers);
              setProfilefollowing(doc.data().following);
              console.log("setting single user properly");
              setSingleUser(doc.data());

              
            });
            // console.log(tempuserarray);
            
          }

          const fetchCurrentUser = async () => {
            let tempuserarray = [];
            const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              // tempuserarray.unshift(doc.data());
              setCurrentUser(doc.data());
              console.log(doc.data());

              if (doc.data().following.includes(location.state.uid)) {
                setFollowbutton(<button className="userfollowbutton" onClick={unfollowUser}>Unfollow</button>);
              } else if (!doc.data().following.includes(location.state.uid)) {
                setFollowbutton(<button className="userfollowbutton" onClick={followUser}>Follow</button>);
              }
            });
            // console.log(tempuserarray);
            
          }
        
            fetchJustUserPosts()
            .catch(console.error);
            fetchJustUser()
            .catch(console.error);
            fetchCurrentUser()
            .catch(console.error);
            setShouldIFetchData(false);
        }

        console.log(currentUser);
        console.log(singleUser);
        
    }, [shouldIFetchData])

    useEffect(() => {
      
      
    }, [shouldIFetchData])

    const [followEffect, setFollowEffect] = useState("neither");

    useEffect(() => {
      if (followEffect === "follow") {
        console.log("FOLLOWING");
        console.log(singleUser);
        console.log(singleUserPosts);
        console.log(currentUser);
        const followEffectFunc = async () => {
        if (singleUser.uid === auth.currentUser.uid) {
            console.log("you can't follow yourself!")
        } else {
            if (currentUser.following.includes(singleUser.uid)) {
                //
                console.log("already followed!")
            } else {
                console.log("WRITING DATA - updating following for current user");
                currentUser.following.push(singleUser.uid);
                const currentuserDocRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(currentuserDocRef, {
                    "following": currentUser.following,
                })

                console.log("WRITING DATA - updating followers for target user");
                let temptargetuserfollowers = singleUser.followers;
                temptargetuserfollowers.push(auth.currentUser.uid);
                const targetuserDocRef = doc(db, "users", singleUser.uid);
                await updateDoc(targetuserDocRef, {
                    "followers": temptargetuserfollowers,
                })
                setShouldIFetchData(true);
                console.log("should be followed!");
            }
        }
          setFollowbutton(<button className="userfollowbutton" onClick={unfollowUser}>Unfollow</button>);
        }
        followEffectFunc();
        setShouldIFetchData(true);
        setFollowEffect("neither");
      }

      if (followEffect === "unfollow") {
        console.log("UNFOLLOWING");
        console.log(singleUser);
        console.log(singleUserPosts);
        console.log(currentUser);
        const followEffectFunc = async () => {
        if (singleUser.uid === auth.currentUser.uid) {
            console.log("you can't unfollow yourself!")
        } else {
            if (!currentUser.following.includes(singleUser.uid)) {
                //
                console.log("already unfollowed!")
            } else {
                console.log("WRITING DATA - updating following for current user");
                const index = currentUser.following.indexOf(singleUser.uid);
                currentUser.following.splice(index, 1);
                const currentuserDocRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(currentuserDocRef, {
                    "following": currentUser.following,
                })

                console.log("WRITING DATA - updating followers for target user");
                let temptargetuserfollowers = singleUser.followers;
                const index2 = currentUser.following.indexOf(currentUser.uid);
                temptargetuserfollowers.splice(index2, 1);
                const targetuserDocRef = doc(db, "users", singleUser.uid);
                await updateDoc(targetuserDocRef, {
                    "followers": temptargetuserfollowers,
                })
                setShouldIFetchData(true);
                console.log("should be followed!");
            }
        }
          // setFollowbutton(<button className="userfollowbutton" onClick={unfollowUser}>Unfollow</button>);
        }
        followEffectFunc();
        setShouldIFetchData(true);
        setFollowEffect("neither");
      }

    }, [followEffect])

    // Follow buttons
    const followUser = async () => {
      setFollowEffect("follow");
      setFollowbutton(<button className="userfollowbutton" onClick={unfollowUser}>Unfollow</button>);
    }

    const unfollowUser = async () => {
      setFollowEffect("unfollow")
      setFollowbutton(<button className="userfollowbutton" onClick={followUser}>Follow</button>);
    }

    const [followbutton, setFollowbutton] = useState(<button className="userfollowbutton" onClick={followUser}>Follow</button>);


    return (
        <div className="usercontainer">
          <div className="usercontent">
            <div className="usertopsection">
              <img className="useruserimage" src={singleUser.photoURL} alt="user's profile"></img>
                <div className="usertopsectionright">
                  <div className="usertopsectionrighttop">
                    <h2 className="userusername">{singleUser.displayName}</h2>
                    {followbutton}
                  </div>

                  <div className="usertopsectionrightmid">
                    <div>Followers: {profilefollowers.length}</div>
                    <div>Following: {profilefollowing.length}</div>
                  </div>

                  <div className="usertopsectionrightbot">
                    <div className="userdesc">{singleUser.description}</div>  
                  </div>
              </div>
            </div>
          
            <div className="userarea">
              {/* {console.log(singleUserPosts)}
              {console.log(singleUser)} */}
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