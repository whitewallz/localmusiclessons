// lib/firebase.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCowdIHhjf8WyiUc_xkXYtCud5DW75SIn8",
  authDomain: "localmusiclessons-ff87b.firebaseapp.com",
  projectId: "localmusiclessons-ff87b",
  storageBucket: "localmusiclessons-ff87b.firebasestorage.app",
  messagingSenderId: "182373655384",
  appId: "1:182373655384:web:abd9fccf03f42382e07b2d",
  measurementId: "G-YK5PF8S253",
}
const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app);
