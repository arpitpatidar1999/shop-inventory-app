// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth  } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCV5D1TEBE0x0cPLygaNMtfP-yZjtziDmM",
  authDomain: "shop-inventory-app-e78f3.firebaseapp.com",
  projectId: "shop-inventory-app-e78f3",
  storageBucket: "shop-inventory-app-e78f3.appspot.com",
  messagingSenderId: "689378695548",
  appId: "1:689378695548:web:f488da5970e8437e79ecf9"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//auth.appVerificationDisabledForTesting(false);
export const db = getFirestore(app);
export {auth};