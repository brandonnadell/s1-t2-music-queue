import firebase from "firebase";

var config = {
    apiKey: "AIzaSyBoZfWr11vupb6dh77zF9bQkUqO4VaYw-0",
    authDomain: "s1-t2-music-queue.firebaseapp.com",
    databaseURL: "https://s1-t2-music-queue.firebaseio.com",
    projectId: "s1-t2-music-queue",
    storageBucket: "s1-t2-music-queue.appspot.com",
    messagingSenderId: "345888857094",
    appId: "1:345888857094:web:1194f736dd83ec1e4d3787",
    measurementId: "G-WDGGB7W6PN"
};
if (!firebase.apps.length) {
    firebase.initializeApp(config);
}
export default firebase;