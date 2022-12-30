import React from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Profile = (props) => {
      
    const getuserinfo = () => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        console.log("user is signed in");
        const uid = user.uid;
        console.log(uid)
        // ...
      } else {
        // User is signed out
        console.log("user is signed out");
        // ...
      }
  });
    }



    return (
        <div>We're on the profile page.
            <button onClick={getuserinfo}></button>
        </div>
    )
}

export default Profile;