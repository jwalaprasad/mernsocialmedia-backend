const firebase = require('firebase/app');
require('dotenv').config();
var firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  };
  firebase.initializeApp(firebaseConfig);

function uploadfile(file) {
  var storageRef = firebase.storage().ref();
  var uploadTask = storageRef.child('images/posts/' + file.name).put(file).then((snapshot) => {
      console.log('Photo Uploaded');
  });
  console.log(uploadTask);
      
  }