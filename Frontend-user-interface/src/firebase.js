import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB13ENRoOYEaalMbFrT8o7ASPozdnB8J44",
  authDomain: "roommapping-group-5.firebaseapp.com",
  projectId: "roommapping-group-5",
  storageBucket: "roommapping-group-5.appspot.com",
  messagingSenderId: "1043815402453",
  appId: "1:1043815402453:web:7f0037a654ac2bd88d8b5c"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = app.auth();

export { auth };