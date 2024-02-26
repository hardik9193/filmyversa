import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAYNgLSeZRpPYoJSJsFEGJ6szV_ptKgMDc",
    authDomain: "filmyverse-6ed7b.firebaseapp.com",
    projectId: "filmyverse-6ed7b",
    storageBucket: "filmyverse-6ed7b.appspot.com",
    messagingSenderId: "985413715227",
    appId: "1:985413715227:web:b2215c65ce6259e6007fbe"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

//get and export database from firestore
export const db = getFirestore(app);

//get and export movie collection from database
export const movieRef = collection(db, "movies")
export const reviewRef = collection(db, "reviews")
export const usersRef = collection(db, "users")
export default app;