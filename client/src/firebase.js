import firebase from 'firebase'; // import syntax has changed for firebase versions above 8


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAGiwC4FvVD6_PT-BXWcNA2SuHvflTWXko",
    authDomain: "ecommerce-d866e.firebaseapp.com",
    databaseURL: "https://ecommerce-d866e.firebaseio.com",
    projectId: "ecommerce-d866e",
    storageBucket: "ecommerce-d866e.appspot.com",
    messagingSenderId: "724119929278",
    appId: "1:724119929278:web:f5add0e00bdbb59be839ef"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
