// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore,doc,getDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD1SUQ6dcMCTGea8UPFnz2BQBSsCe-8bvM",
    authDomain: "medical-examiner.firebaseapp.com",
    projectId: "medical-examiner",
    storageBucket: "medical-examiner.appspot.com",
    messagingSenderId: "299984805114",
    appId: "1:299984805114:web:2f7cdf5a979e0e4dcdbd43",
    measurementId: "G-VVVQDT9TWZ"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };
