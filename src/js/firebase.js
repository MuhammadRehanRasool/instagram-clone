import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBVvVNCUwN7VNk_WVIj21Itt_XEELawxbs",
  authDomain: "instagram-clone-d1624.firebaseapp.com",
  projectId: "instagram-clone-d1624",
  storageBucket: "instagram-clone-d1624.appspot.com",
  messagingSenderId: "1051401799531",
  appId: "1:1051401799531:web:3b65a057f10c3f354fae2e",
  measurementId: "G-P39T5JQMMF"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};