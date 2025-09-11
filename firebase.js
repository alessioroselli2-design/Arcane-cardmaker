// firebase.js — inizializza Firebase e mette tutto su window._fb

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  doc, setDoc, getDoc, getDocs, collection, query, where
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {
  getStorage,
  ref, uploadBytes, getDownloadURL, listAll
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

// 🔑 La tua configurazione
const firebaseConfig = {
  apiKey: "AIzaSyC2yGBahkZpzd4bRsIHThpUHTl1TtpSwKI",
  authDomain: "cardmaker-15cf5.firebaseapp.com",
  projectId: "cardmaker-15cf5",
  storageBucket: "cardmaker-15cf5.appspot.com",
  messagingSenderId: "782546269609",
  appId: "1:782546269609:web:934c5740d007558bb900b8",
  measurementId: "G-W68B78G600"
};

// Inizializza
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Metti tutto in window._fb
window._fb = {
  app, auth, db, storage,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  doc, setDoc, getDoc, getDocs, collection, query, where,
  ref, uploadBytes, getDownloadURL, listAll
};

// Debug in console
console.log("[Firebase] Inizializzato ✔");
