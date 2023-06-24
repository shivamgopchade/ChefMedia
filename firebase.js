// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDp_g3pGl2GVXyf6AmVQtPC4hH4QrQsfdw",
  authDomain: "chefmedia-1ce2a.firebaseapp.com",
  projectId: "chefmedia-1ce2a",
  storageBucket: "chefmedia-1ce2a.appspot.com",
  messagingSenderId: "277847103360",
  appId: "1:277847103360:web:97ba0be84abe15cb9f1365",
  measurementId: "G-D1YV1QVE3D",
  databaseURL: "https://chefmedia-1ce2a-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
let app;
app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, storage };
