
import firebase from "firebase/app";
import "firebase/auth";

export const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAjnP2_XdUwm5wUsjP0nvLXBFmJOD1d8hU",
    projectId: process.env.FIREBASE_PROJECT_ID || "kaiyo-a3d18",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://kaiyo-a3d18.firebaseio.com",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "kaiyo-a3d18.firebaseapp.com",
    appId: "1:234538860836:web:fb0d759d5ae2fac02af3b1",
    messagingSenderId: "234538860836",
    measurementId: "G-MWJ2N47Q74",
    storageBucket: "kaiyo-a3d18.appspot.com",
};

firebase.initializeApp(firebaseConfig);
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();