import firebase from "firebase";
import configuration from "./config";

var devConfig = {
  apiKey: "AIzaSyBoZfWr11vupb6dh77zF9bQkUqO4VaYw-0",
  authDomain: "s1-t2-music-queue.firebaseapp.com",
  databaseURL: "https://s1-t2-music-queue.firebaseio.com",
  projectId: "s1-t2-music-queue",
  storageBucket: "s1-t2-music-queue.appspot.com",
  messagingSenderId: "345888857094",
  appId: "1:345888857094:web:1194f736dd83ec1e4d3787",
  measurementId: "G-WDGGB7W6PN",
};

var prodConfig = {
  apiKey: "AIzaSyB_zcTUEQfBngQO8Y1403JFpluh1mbyK_A",
  authDomain: "s1-t2-music-queue-prod.firebaseapp.com",
  databaseURL: "https://s1-t2-music-queue-prod.firebaseio.com",
  projectId: "s1-t2-music-queue-prod",
  storageBucket: "s1-t2-music-queue-prod.appspot.com",
  messagingSenderId: "5247660415",
  appId: "1:5247660415:web:9825505e722848f982aa4a",
  measurementId: "G-ZYFFQ1VKQ0",
};

var config =
  configuration.FIREBASE_ENV === "development" ? devConfig : prodConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}
export default firebase;
