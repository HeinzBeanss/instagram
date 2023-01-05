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
import { useFetcher } from "react-router-dom";

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
      console.log(tempUserDataOnProfile);
     

  }
  }, [shouldIFetchDataOnProfile, tempUserDataOnProfile])



  async function onMediaFileSelected(event) {
    event.preventDefault();
    var file = event.target.files[0];
    // checks if it's an image file.
    if (!file.type.match('image.*')) { 
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

  // 
  const handleChange = (e) => {
    console.log(e.target);
    console.log("is this working");
    // console.log(actualDesc);
    console.log(e.target.value);
    setActualDesc(e.target.value);
  }

  // const editBio = () => {
  //   setDescElement(<input type="text" className="profiledescinput" placeholder="Enter a profile description..." onChange={handleChange}></input>)
  //   setButtonElement(<button className="savebiobutton" onClick={startthesave}>Save bio</button>)
  // }

  let [actualDesc, setActualDesc] = useState("");
  let [shouldISave, setShouldISave] = useState(false);

  // let [descElement, setDescElement] = useState(<div className="profiledesc">{tempUserDataOnProfile.description}</div>)
  // let [buttonElement, setButtonElement] = useState(<button className="editbiobutton" onClick={editBio}>Edit bio</button>)


  // useEffect(() => {
  //   console.log(shouldISave);

  //   if (shouldISave === true) {

  //     const saveBio = async () => {
  //       console.log("attempting to save");
  //       console.log(actualDesc.length);
  //       if (actualDesc.length < 150) {
  //         console.log("ATTEMPTING TO UPDATE DOC");
  //         console.log(actualDesc);
  //         const currentUserRefForDesc = doc(db, "users", auth.currentUser.uid);
  //         await updateDoc(currentUserRefForDesc, {
  //           "description": actualDesc,
  //       }).catch((error) => {
  //         console.log(error);
  //       });
  //       console.log("written.")
  //       setDescElement(<div className="profiledesc">{tempUserDataOnProfile.description}</div>);
  //       setButtonElement(<button className="editbiobutton" onClick={editBio}>Edit bio</button>);
        
  //       }
  //     }

  //     setShouldISave(false);
  //     saveBio();
  //     setShouldIFetchDataOnProfile(true);
  //   }

  // }, [shouldISave]);

  const startthesave = () => {
    console.log("startingsave")
    setShouldISave(true);
  } 

  // useEffect(() => {
  //   console.log(actualDesc);
  //   console.log("above is the actual desc");
  // }, [actualDesc]);

  const [savebuttonstyle, setSavebuttonstyle] = useState({ display: "none"});
  const [editbuttonstyle, setEditbuttonstyle] = useState({});
  const [normaldescstyle, setNormaldescstyle] = useState({});
  const [inputdescstyle, setInputdescstyle] = useState({ display: "none"});

  useEffect(() => {
    console.log(shouldISave);

    if (shouldISave === true) {

      const saveBio = async () => {
        console.log("attempting to save");
        console.log(actualDesc.length);
        if (actualDesc.length < 150) {
          console.log("ATTEMPTING TO UPDATE DOC");
          console.log(actualDesc);
          const currentUserRefForDesc = doc(db, "users", auth.currentUser.uid);
          await updateDoc(currentUserRefForDesc, {
            "description": actualDesc,
        }).catch((error) => {
          console.log(error);
        });
        console.log("written.")
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

  // useEffect(() => {
  //   console.log("FOLLOWING INFO HAS BEEN CHANGED");
  //   setShouldIFetchDataOnProfile(true);
  // }, [profilefollowers, profilefollowing])

    return (
        <div className="profilecontainer">
          <div className="profilecontent">
          <div className="profiletopsection">
            <input className="profilefileclick" type="file" accept="image/*" onChange={onMediaFileSelected}></input>
            <img className="profileuserimage" src={tempUserDataOnProfile.photoURL} alt="user's profile" onClick={ (e) => {
                e.preventDefault();
                const mediaCaptureElement = document.querySelector(".profilefileclick");
                console.log(mediaCaptureElement);
                mediaCaptureElement.click();
            }}></img>
            <div className="profiletopsectionright">
              <div className="profiletopsectionrighttop">
                <h2 className="profilename">{tempUserDataOnProfile.displayName}</h2>
                {/* {buttonElement} */}
                <button style={savebuttonstyle} className="savebiobutton" onClick={startthesave}>Save bio</button>
                <button style={editbuttonstyle} className="editbiobutton" onClick={editBio}>Edit bio</button>
                
              </div>
              <div className="profiletopsectionrightmid">
                {/* <div className="profilefollowinginfo">{tempUserDataOnProfile.followers.length} followers</div>
                <div className="profilefollowinginfo">{tempUserDataOnProfile.following.length} following</div> */}
                <div className="profilefollowinginfo">{profilefollowers.length} followers</div>
                <div className="profilefollowinginfo">{profilefollowing.length} following</div>
              </div>
              <div className="profiletopsectionrightbot">
                {/* {descElement} */}
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