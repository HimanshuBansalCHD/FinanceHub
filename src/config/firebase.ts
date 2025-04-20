// src/config/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBLU-UrskS1qesRKL9o6ubaLBOvT8pU-Dc",
  authDomain: "financehub-8d846.firebaseapp.com",
  projectId: "financehub-8d846",
  storageBucket: "financehub-8d846.appspot.com", // fixed typo!
  messagingSenderId: "598728224886",
  appId: "1:598728224886:ios:9ea191265b31fe6c33ef57",
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Auth
const auth = getAuth(app);

const db = getFirestore(app);

export { app, auth, db };
