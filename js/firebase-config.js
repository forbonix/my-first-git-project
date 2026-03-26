// js/firebase-config.js

// YOUR FIREBASE CONFIGURATION
// Replace the placeholder below with your actual config from the Firebase Console:
// Project Settings -> General -> Your apps -> Web apps -> Config
const firebaseConfig = {
    apiKey: "AIzaSyDIOLg3RMBDYabUVla1d3t6QwlRvrWoItQ",
    authDomain: "thaniyamhub.firebaseapp.com",
    projectId: "thaniyamhub",
    storageBucket: "thaniyamhub.firebasestorage.app",
    messagingSenderId: "1071417916918",
    appId: "1:1071417916918:web:2b323ef0593656f1ca9bd7",
    measurementId: "G-5BEVWY4MYH"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
} else {
    console.error("Firebase SDK not loaded. Please ensure you are online and the scripts are included.");
}
