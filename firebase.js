// firebase.js — espone solo la config su window, senza inizializzare nulla
// (così non va in conflitto con il tuo auth.js che già inizializza Firebase)

export const firebaseConfig = {
  apiKey: "AIzaSyC2yGBahkZpzd4bRsIHThpUHTl1TtpSwKI",
  authDomain: "cardmaker-15cf5.firebaseapp.com",
  projectId: "cardmaker-15cf5",
  storageBucket: "cardmaker-15cf5.firebasestorage.app",
  messagingSenderId: "782546269609",
  appId: "1:782546269609:web:934c5740d007558bb900b8",
  measurementId: "G-W68B78G600"
};

// mettila anche sul window, così qualsiasi script può leggerla
window.__ACM_FIREBASE_CONFIG = firebaseConfig;
