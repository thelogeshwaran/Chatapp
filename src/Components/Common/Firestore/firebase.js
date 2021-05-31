import firebase from "firebase";

var firebaseConfig = {
  apiKey: "AIzaSyBfgdaKgzQ4XW_3uiwycWKAIrLwjvt7piw",
  authDomain: "chat-app-fb4a1.firebaseapp.com",
  projectId: "chat-app-fb4a1",
  storageBucket: "chat-app-fb4a1.appspot.com",
  messagingSenderId: "369295834308",
  appId: "1:369295834308:web:0feeae5df4733a81629d91",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const projectStorage = firebase.storage();

export { auth, db, projectStorage };
