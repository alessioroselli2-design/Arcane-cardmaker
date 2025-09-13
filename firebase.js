// firebase.js — init centralizzato + API in window._fb
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth, onAuthStateChanged,
  signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore, serverTimestamp,
  collection, doc, setDoc, getDocs, query, orderBy, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {
  getStorage, ref as sRef, uploadString, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

// 🔑 Config del tuo progetto
const firebaseConfig = {
  apiKey: "AIzaSyC2yGBahkZpzd4bRsIHThpUHTl1TtpSwKI",
  authDomain: "cardmaker-15cf5.firebaseapp.com",
  projectId: "cardmaker-15cf5",
  storageBucket: "cardmaker-15cf5.appspot.com",
  messagingSenderId: "782546269609",
  appId: "1:782546269609:web:934c5740d007558bb900b8",
  measurementId: "G-W68B78G600"
};

// Init una volta sola
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const st   = getStorage(app);

// Espongo tutto in window._fb per gli altri moduli
window._fb = {
  app, auth, db, st,
  // auth
  onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut,
  // firestore
  serverTimestamp, collection, doc, setDoc, getDocs, query, orderBy, deleteDoc,
  // storage
  sRef, uploadString, getDownloadURL, deleteObject
};

console.log("[Firebase] Inizializzato ✔");
