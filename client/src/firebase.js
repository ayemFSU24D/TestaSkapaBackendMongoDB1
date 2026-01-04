// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: VITE_FIREBASE_API_KEY, //inte nödvändigt att ha den i 
  authDomain: "my-exjob.firebaseapp.com",
  projectId: "my-exjob",
  storageBucket: "my-exjob.firebasestorage.app",
  messagingSenderId: "241605177386",
  appId: "1:241605177386:web:9c5b43e06e395b65c09353",
  measurementId: "G-D4S5SRNND1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);