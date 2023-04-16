import React from 'react'
import { storage } from '../config/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import Home from './Home';

function Profile(props) {
    const uploadFile=async(file,authUser,setLoading)=>{
        const fileRef = ref(storage,"images/"+authUser.email+'.png');
      
        setLoading(true)
        const snapshot = await uploadBytes(fileRef,file);
        const photoURL = await getDownloadURL(fileRef)
        
        
      }
  return (
    <div>
       {props.authUser.photoURL}


    </div>
  )
}

export default Profile