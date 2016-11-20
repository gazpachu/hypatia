import * as firebase from 'firebase';

// Firebase config
export const firebaseConfig = {
  	apiKey: "",
    authDomain: "",
    databaseURL: "",
	storageBucket: "",
    messagingSenderId: ""
}

// Firebase initialization
firebase.initializeApp(firebaseConfig);
export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth;