// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "atmanirvar-a8468.firebaseapp.com",
  projectId: "atmanirvar-a8468",
  storageBucket: "atmanirvar-a8468.appspot.com",
  messagingSenderId: "803713359470",
  appId: "1:803713359470:web:8746973514b403b0d9d07f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
