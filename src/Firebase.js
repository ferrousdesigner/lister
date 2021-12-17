import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, EmailAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARXqxIGZFmZBo4CamcvAZP7majjG_nZjI",
  authDomain: "project-listup.firebaseapp.com",
  projectId: "project-listup",
  storageBucket: "project-listup.appspot.com",
  messagingSenderId: "965819592623",
  appId: "1:965819592623:web:13c4e3663d87d0d365495a",
  measurementId: "G-X8K347275R",
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
export const db = getFirestore();
console.log('firebase, ',firebase)

export const analytics = getAnalytics(firebase);
