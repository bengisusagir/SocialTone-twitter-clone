
import { initializeApp } from "firebase/app";
import {getAuth ,GoogleAuthProvider,updateProfile} from  "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyCuhiOYtiKQt3qEI0eazmyZ8YVufMkqB9w",
  authDomain: "socialtone-ua.firebaseapp.com",
  projectId: "socialtone-ua",
  storageBucket: "socialtone-ua.appspot.com",
  messagingSenderId: "477097332796",
  appId: "1:477097332796:web:29dd979561204edf26b339",
  measurementId: "G-XFECFKX6D1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const upPro = updateProfile(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

