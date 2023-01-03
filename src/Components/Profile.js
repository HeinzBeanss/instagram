import React, { useEffect, useState } from "react";
import "../CSS/Profile.css"
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

const Profile = (props) => {

  const [file, setFile] = useState();
  const [userPosts, setUserPosts] = useState([]);
  const [shouldIFetchDataOnProfile, setShouldIFetchDataOnProfile] = useState(true);
  const [tempUserDataOnProfile, setTempUserDataOnProfile] = useState([]);

  useEffect(() => {
    console.log("USING EFFECT ON PROFILE");
    console.log(shouldIFetchDataOnProfile);
    if (shouldIFetchDataOnProfile === true) {
      const fetchUsers = async () => {
          let temparray = [];
          const querySnapshot = await getDocs(collection(db, "users"));
          console.log("FETCHING DATA");
          querySnapshot.forEach((doc) => {
              if (doc.data().uid === auth.currentUser.uid) {
  
                  setTempUserDataOnProfile(doc.data());
              }
          });
      }   
      fetchUsers()
      .catch(console.error);
      setShouldIFetchDataOnProfile(false);
  }
  }, [shouldIFetchDataOnProfile])

  useEffect(() => {
    console.log("use effect ONLY ON START")
    
    const fetchJustUserPosts = async () => {
      let tempuserpostarray = [];
      const q = query(collection(db, "posts"), where("useruid", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        tempuserpostarray.unshift(doc.data());
      });
      setUserPosts(tempuserpostarray);
    }

    fetchJustUserPosts();
  }, [])


  async function onMediaFileSelected(event) {
    event.preventDefault();
    var file = event.target.files[0];
    // checks if it's an image file.
    if (!file.type.match('image.*')) { 
      var data = {
        message: 'You can only share images',
        timeout: 2000,
      };
      console.log("NOT AN IMAGE")
      return;
    }

    setFile(file);
    console.log("adding new profile picture");
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
      console.log("profile picture updated!")
      setShouldIFetchDataOnProfile(true);
      props.setShouldIUpdateNav(true);
    }).catch((error) => {
      // An error occurred
      // ...
      console.log(error);
    });

  }


    return (
        <div className="profilecontainer">
          <div className="profiletopsection">
            <h2>{tempUserDataOnProfile.displayName}</h2>
            <input className="profilefileclick" type="file" accept="image/*" onChange={onMediaFileSelected}></input>
            <img src={tempUserDataOnProfile.photoURL} alt="user's profile" onClick={ (e) => {
                e.preventDefault();
                const mediaCaptureElement = document.querySelector(".profilefileclick");
                console.log(mediaCaptureElement);
                mediaCaptureElement.click();
            }}></img>
          </div>
          
          <div className="profiledesc">{tempUserDataOnProfile.description}</div>
          <div className="profilefollowing">
            {/* <div>Followers: {tempUserDataOnProfile.followers.length}</div>
            <div>Following: {tempUserDataOnProfile.following.length}</div> */}
          </div>
          
          <div className="profilearea">
            {userPosts.map((post, index) => {
              return (
                <img key={index} src={post.imageUrl} alt="user post"></img>
              )
            })}
          </div>
        </div>
    )
}

export default Profile;