import React, { useEffect, useState } from "react";
import "../CSS/Profile.css"

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, updateProfile } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  updateDoc,
  doc,
  getDocs,
  where,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable
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

const Profile = (props) => {

  const [file, setFile] = useState();
  const [userPosts, setUserPosts] = useState([]);
  const [shouldIFetchDataOnProfile, setShouldIFetchDataOnProfile] = useState(true);
  const [tempUserDataOnProfile, setTempUserDataOnProfile] = useState([]);

  useEffect(() => {
    if (shouldIFetchDataOnProfile === true) {
      const fetchUsers = async () => {
          const querySnapshot = await getDocs(collection(db, "users"));
          querySnapshot.forEach((doc) => {
              if (doc.data().uid === auth.currentUser.uid) {
                  setTempUserDataOnProfile(doc.data());
                  setProfilefollowers(doc.data().followers);
                  setProfilefollowing(doc.data().following);
              }
          })
        }   

      const fetchJustUserPosts = async () => {
        let tempuserpostarray = [];
        const q = query(collection(db, "posts"), where("useruid", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          tempuserpostarray.unshift(doc.data());
        });
        setUserPosts(tempuserpostarray);
      }
      fetchUsers()
      .catch(console.error);
      fetchJustUserPosts()
      .catch(console.error)
      setShouldIFetchDataOnProfile(false);
  }
  }, [shouldIFetchDataOnProfile, tempUserDataOnProfile])

  async function onMediaFileSelected(event) {
    event.preventDefault();
    var file = event.target.files[0];
    // checks if it's an image file.
    if (!file.type.match('image.*')) { 
      console.log("NOT AN IMAGE");
      return;
    }
    console.log(file);
    setFile(file);

    const tempFilePath = `profilePictures/${file.name}`;
    const newImageRef = ref(getStorage(), tempFilePath);
    const fileSnapshot = await uploadBytesResumable(newImageRef, file);
    
      // 3 - Generate a public URL for the file.
    const publicImageUrl = await getDownloadURL(newImageRef);
    
    // update both user object 
    const currentuserDocRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(currentuserDocRef, {
        "photoURL": publicImageUrl,
    })
  
    // and user auth profile picture.
    updateProfile(auth.currentUser, {
      photoURL: publicImageUrl
    }).then(() => {
      // Profile updated!
      // ...
      console.log("Profile Picture Updated!")
      setShouldIFetchDataOnProfile(true);
      props.setShouldIUpdateNav(true);
    }).catch((error) => {
      // An error occurred
      // ...
      console.log(error);
    });
  }

  const handleChange = (e) => {
    setActualDesc(e.target.value);
  }

  let [actualDesc, setActualDesc] = useState("");
  let [shouldISave, setShouldISave] = useState(false);

  const startthesave = () => {
    setShouldISave(true);
  } 

  const [savebuttonstyle, setSavebuttonstyle] = useState({ display: "none"});
  const [editbuttonstyle, setEditbuttonstyle] = useState({});
  const [normaldescstyle, setNormaldescstyle] = useState({});
  const [inputdescstyle, setInputdescstyle] = useState({ display: "none"});

  useEffect(() => {

    if (shouldISave === true) {

      const saveBio = async () => {
        if (actualDesc.length < 150) {
          const currentUserRefForDesc = doc(db, "users", auth.currentUser.uid);
          await updateDoc(currentUserRefForDesc, {
            "description": actualDesc,
        }).catch((error) => {
          console.log(error);
        });
        setEditbuttonstyle({ });
        setSavebuttonstyle({ display: "none"});
        setNormaldescstyle({ });
        setInputdescstyle({ display: "none"});
        }
      }

      setShouldISave(false);
      saveBio();
      setShouldIFetchDataOnProfile(true);
    }

  }, [shouldISave]);

  const editBio = () => {
    setEditbuttonstyle({ display: "none"});
    setSavebuttonstyle({ });
    setNormaldescstyle({ display: "none"});
    setInputdescstyle({ });
  }

  const [profilefollowers, setProfilefollowers] = useState([]);
  const [profilefollowing, setProfilefollowing] = useState([]);

    return (
        <div className="profilecontainer">
          <div className="profilecontent">
          <div className="profiletopsection">
            <input className="profilefileclick" type="file" accept="image/*" onChange={onMediaFileSelected}></input>
            <img className="profileuserimage" src={tempUserDataOnProfile.photoURL} alt="user's profile" onClick={ (e) => {
                e.preventDefault();
                const mediaCaptureElement = document.querySelector(".profilefileclick");
                mediaCaptureElement.click();
            }}></img>
            <div className="profiletopsectionright">
              <div className="profiletopsectionrighttop">
                <h2 className="profilename">{tempUserDataOnProfile.displayName}</h2>

                <button style={savebuttonstyle} className="savebiobutton" onClick={startthesave}>Save bio</button>
                <button style={editbuttonstyle} className="editbiobutton" onClick={editBio}>Edit bio</button>
                
              </div>
              <div className="profiletopsectionrightmid">
                <div className="profilefollowinginfo">{profilefollowers.length} followers</div>
                <div className="profilefollowinginfo">{profilefollowing.length} following</div>
              </div>
              <div className="profiletopsectionrightbot">
                <div style={normaldescstyle} className="profiledesc">{tempUserDataOnProfile.description}</div>
                <textarea style={inputdescstyle} rows="4" className="profiledescinput" placeholder="Enter a profile description..." onChange={handleChange}></textarea>
              </div>
            </div>
          </div>
          
          <div className="profilearea">
            {userPosts.map((post, index) => {
              return (
                <img className="profileimage" key={index} src={post.imageUrl} alt="user post"></img>
              )
            })}
          </div>
          </div>
        </div>
    )
}

export default Profile;