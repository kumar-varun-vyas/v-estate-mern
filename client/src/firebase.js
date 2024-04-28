// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "v-estate-f2960.firebaseapp.com",
    projectId: "v-estate-f2960",
    storageBucket: "v-estate-f2960.appspot.com",
    messagingSenderId: "527220099061",
    appId: "1:527220099061:web:3b07572ae1f239b3d3c2bc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
