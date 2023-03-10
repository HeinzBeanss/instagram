import React, { useState } from "react";
import "../CSS/CreatePost.css"

// Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {
    getFirestore,
    collection,
    addDoc,
    updateDoc,
    serverTimestamp,
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

const CreatePost = (props) => {

    const [file, setFile] = useState();
    const [caption, setCaption] = useState();
    const [displayNoneStyle, setDisplayNoneStyle] = useState();
    const [uploadImageArea, setUploadImageArea] = useState();

    const handleChange = (e) => {
      setCaption(e.target.value);
    }

    var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

    async function onMediaFileSelected(event) {
        event.preventDefault();
        var file = event.target.files[0];
        if (!file.type.match('image.*')) { 
          console.log("NOT AN IMAGE!");
          return;
        }

        console.log(file);
        setFile(file);
        const tempFilePath = `tempUploads/${file.name}`;
        const newImageRef = ref(getStorage(), tempFilePath);
        const fileSnapshot = await uploadBytesResumable(newImageRef, file);
        
          // 3 - Generate a public URL for the file.
        const publicImageUrl = await getDownloadURL(newImageRef);
        setDisplayNoneStyle({display: "none"});
        setUploadImageArea(<img className="tempimageupload" src={`${publicImageUrl}`} alt="uploaded by user"></img>)
      }

      function getUserName() {
        return getAuth().currentUser.displayName;
      }

      function getUserUid() {
        return getAuth().currentUser.uid;
      }

      function getProfilePicUrl() {
        return getAuth().currentUser.photoURL || 'https://firebasestorage.googleapis.com/v0/b/instagram-ed084.appspot.com/o/default-profile-picture.png?alt=media&token=46359339-51c1-43b6-8a15-c79ca3981d21';
      }

      async function saveImageMessage(file) {
        try {
          // 1 - We add a message with a loading icon that will get updated with the shared image.
          const messageRef = await addDoc(collection(getFirestore(), 'posts'), {
            name: getUserName(),
            useruid: getUserUid(),
            imageUrl: LOADING_IMAGE_URL,
            profilePicUrl: getProfilePicUrl(),
            timestamp: serverTimestamp(),
            caption: caption,
            likes: [],
            comments: [],
          });
          
          const newMessageRef = await updateDoc(messageRef, {
            postid: messageRef.id
          } )     

          // 2 - Upload the image to Cloud Storage.
          const filePath = `${getAuth().currentUser.uid}/${messageRef.id}/${file.name}`;
          const newImageRef = ref(getStorage(), filePath);
          const fileSnapshot = await uploadBytesResumable(newImageRef, file);
          
          // 3 - Generate a public URL for the file.
          const publicImageUrl = await getDownloadURL(newImageRef);

          // 4 - Update the chat message placeholder with the image's URL.
          await updateDoc(messageRef,{
            imageUrl: publicImageUrl,
            storageUri: fileSnapshot.metadata.fullPath
          });

          console.log("Successfully Uploaded");
          props.setCreatePost([]);
        } catch (error) {
          console.error('There was an error uploading a file to Cloud Storage:', error);
        }
      }
    

    return (
        <div className="createbodyroot">

            <div className="createbody">
                <div className="createaposttitle">Create a post</div>
                <input className="fileclick" type="file" accept="image/*" onChange={onMediaFileSelected}></input>
                <div className="uploadimagearea" style={displayNoneStyle} onClick={ (e) => {
                    e.preventDefault();
                    const mediaCaptureElement = document.querySelector(".fileclick");
                    mediaCaptureElement.click();
                }}>Click here to upload an image</div>
                {uploadImageArea}
                <textarea className="captionarea" placeholder="Write a caption..." onChange={handleChange}></textarea>
                <div className="sharepostbuttonarea">
                    <button className="sharepostbutton" onClick={ () => saveImageMessage(file)}>Share</button>
                </div>
                
            </div>

            <div className="exitcreatepost" onClick={ () => props.setCreatePost([])}></div>
            <div className="createpostbody" onClick={ () => props.setCreatePost([])}>
            
        </div>
        </div>
        
    )
}

export default CreatePost;