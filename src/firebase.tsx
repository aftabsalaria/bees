// firebase.tsx

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBwYALFERsSCsuJRF24SpjGYIcm_Sd0AB4",
  authDomain: "bees-411317.firebaseapp.com",
  databaseURL: "https://bees-411317-default-rtdb.firebaseio.com",
  projectId: "bees-411317",
  storageBucket: "bees-411317.appspot.com",
  messagingSenderId: "132725603577",
  appId: "1:132725603577:web:5b66a614fc51646cd57628",
  measurementId: "G-W5K4PCVH8E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export { app };
