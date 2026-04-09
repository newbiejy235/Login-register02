// import { initializeApp } from "firebase/app";
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const { initializeApp } = require("firebase/app");
const {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail, // tambah ini
} = require("firebase/auth");

const firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

module.exports = {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
};
