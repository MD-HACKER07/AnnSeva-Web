import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDa4dDajgdLf-PZr7MIkdW9y8-jcPggGiQ",
  authDomain: "annseva-dbbbd.firebaseapp.com",
  projectId: "annseva-dbbbd",
  storageBucket: "annseva-dbbbd.firebasestorage.app",
  messagingSenderId: "808865349776",
  appId: "1:808865349776:web:2eecb585a15bde97909815",
  measurementId: "G-8Y7N3SH4CR",
};

// Prevent re-initialization during hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
