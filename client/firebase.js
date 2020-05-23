import firebase from "firebase";
import configuration from "../utils/config";

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

firebase.setAuthStateListener = (listener) => {
  firebase.auth().onAuthStateChanged(listener);
};

firebase.getCurrentUser = () => {
  return firebase.auth().currentUser;
};

firebase.updateProfile = async (profile) => {
  if (!firebase.auth().currentUser) return;
  await firebase.auth().currentUser.updateProfile({
    displayName: profile.name,
    photoURL: profile.picture,
  });
};

firebase.setToken = async (token) => {
  await firebase.auth().signInWithCustomToken(token);
};

firebase.signOut = async () => {
  await firebase.auth().signOut();
};

firebase.createSong = (url, title, img, roomId, name) => {
  let videoUrl = "https://www.youtube.com/watch?v=" + url;
  firebase
    .database()
    .ref("rooms/" + roomId + "/currentPosition")
    .once("value", function (snapshot) {
      let pos = snapshot.val();
      firebase
        .database()
        .ref("rooms/" + roomId + "/songs/")
        .push()
        .set({
          title: title,
          image: img,
          videoUrl: videoUrl,
          rating: 0,
          position: pos,
          votedUsers: [],
          progress: 0,
          addedBy: name,
          playing: false,
        })
        .then(() => {
          pos--;
          firebase
            .database()
            .ref("rooms/" + roomId + "/currentPosition")
            .set(pos);
        });
    });
};

export default firebase;
