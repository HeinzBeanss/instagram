// follow function for explore page - since removed explore page follow button
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

// explore page user cards - since discarded
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

// On home page
const completeComment = () => {
    console.log("setting comments");
    
}

// for Profile edit description, failed attempt.
  // const editBio = () => {
  //   setDescElement(<input type="text" className="profiledescinput" placeholder="Enter a profile description..." onChange={handleChange}></input>)
  // i didnt set value on the input above, that was probably it then right...
  //   setButtonElement(<button className="savebiobutton" onClick={startthesave}>Save bio</button>)
  // }

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

    // useEffect(() => {
  //   console.log(actualDesc);
  //   console.log("above is the actual desc");
  // }, [actualDesc]);

  // return elements of edit bio attempt
   {/* {buttonElement} */}
 {/* <div className="profilefollowinginfo">{tempUserDataOnProfile.followers.length} followers</div>
 <div className="profilefollowinginfo">{tempUserDataOnProfile.following.length} following</div> */}
 {/* {descElement} */}