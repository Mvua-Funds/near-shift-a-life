// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage} from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBy8A1YPYg3Uuwak_vY-6k74v6LN_C3Sv0",
  authDomain: "uplaodingimage.firebaseapp.com",
  projectId: "uplaodingimage",
  storageBucket: "uplaodingimage.appspot.com",
  messagingSenderId: "1093659185965",
  appId: "1:1093659185965:web:7825044fe7fc2db815f9a4"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);
 export const storage=getStorage(app);