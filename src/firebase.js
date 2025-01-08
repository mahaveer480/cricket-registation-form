// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA_q9qgz73RYWR9CgmBXd9oH8tWc4B0PNg",
  authDomain: "north-coloney-lea.firebaseapp.com",
  projectId: "north-coloney-lea",
  storageBucket: "north-coloney-lea.firebasestorage.app",
  messagingSenderId: "505276782992",
  appId: "1:505276782992:web:49bb2a2db735a8ad943b15",
  measurementId: "G-P0ZMH08382"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
