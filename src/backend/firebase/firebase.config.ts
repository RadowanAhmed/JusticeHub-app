// Your Firebase configuration
{/* const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
}; */}


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFdXvc851pHWqQKtnpPLTgImE3pVGbZDc",
  authDomain: "orient-app-fe175.firebaseapp.com",
  projectId: "orient-app-fe175",
  storageBucket: "orient-app-fe175.firebasestorage.app",
  messagingSenderId: "547640877870",
  appId: "1:547640877870:web:d558dbcec40a1f9f7f90bf",
  measurementId: "G-2Y20TPWCJG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);