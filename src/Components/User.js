import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom'

import "../CSS/User.css"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  updateDoc,
  doc,
  getDocs,
  where
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
            const q = query(collection(db, "users"), where("uid", "==", location.state.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              setProfilefollowers(doc.data().followers);
              setProfilefollowing(doc.data().following);
              setSingleUser(doc.data());
            });
          }

          const fetchCurrentUser = async () => {
            const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              setCurrentUser(doc.data());
              if (doc.data().following.includes(location.state.uid)) {
                setFollowbutton(<button className="userfollowbutton" onClick={unfollowUser}>Unfollow</button>);
              } else if (!doc.data().following.includes(location.state.uid)) {
                setFollowbutton(<button className="userfollowbutton" onClick={followUser}>Follow</button>);
              }
            });            
          }
            fetchJustUserPosts()
            .catch(console.error);
            fetchJustUser()
            .catch(console.error);
            fetchCurrentUser()
            .catch(console.error);
            setShouldIFetchData(false);
        }        
    }, [shouldIFetchData])

    const [followEffect, setFollowEffect] = useState("neither");

    useEffect(() => {
      if (followEffect === "follow") {
        const followEffectFunc = async () => {
        if (singleUser.uid === auth.currentUser.uid) {
        } else {
            if (currentUser.following.includes(singleUser.uid)) {
                //
            } else {
                currentUser.following.push(singleUser.uid);
                const currentuserDocRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(currentuserDocRef, {
                    "following": currentUser.following,
                })
                let temptargetuserfollowers = singleUser.followers;
                temptargetuserfollowers.push(auth.currentUser.uid);
                const targetuserDocRef = doc(db, "users", singleUser.uid);
                await updateDoc(targetuserDocRef, {
                    "followers": temptargetuserfollowers,
                })
                setShouldIFetchData(true);
            }
        }
          setFollowbutton(<button className="userfollowbutton" onClick={unfollowUser}>Unfollow</button>);
        }
        followEffectFunc();
        setShouldIFetchData(true);
        setFollowEffect("neither");
      }

      if (followEffect === "unfollow") {
        const followEffectFunc = async () => {
        if (singleUser.uid === auth.currentUser.uid) {
        } else {
            if (!currentUser.following.includes(singleUser.uid)) {
                //
            } else {
                const index = currentUser.following.indexOf(singleUser.uid);
                currentUser.following.splice(index, 1);
                const currentuserDocRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(currentuserDocRef, {
                    "following": currentUser.following,
                })

                let temptargetuserfollowers = singleUser.followers;
                const index2 = currentUser.following.indexOf(currentUser.uid);
                temptargetuserfollowers.splice(index2, 1);
                const targetuserDocRef = doc(db, "users", singleUser.uid);
                await updateDoc(targetuserDocRef, {
                    "followers": temptargetuserfollowers,
                })
                setShouldIFetchData(true);
            }
          }
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