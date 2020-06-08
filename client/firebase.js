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

export const testingConfig = {
  apiKey: "AIzaSyA0VFNDZf0Q6fCCv9HApoVwjlmG91sOAwI",
  authDomain: "s1-t2-music-queue-testing.firebaseapp.com",
  databaseURL: "https://s1-t2-music-queue-testing.firebaseio.com",
  projectId: "s1-t2-music-queue-testing",
  storageBucket: "s1-t2-music-queue-testing.appspot.com",
  messagingSenderId: "754596016797",
  appId: "1:754596016797:web:ead3e732648dba3a5eda74",
  measurementId: "G-V5VY5TM1T3",
};

var config =
  configuration.FIREBASE_ENV === "development"
    ? devConfig
    : configuration.FIREBASE_ENV === "testing"
    ? testingConfig
    : prodConfig;

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

firebase.updatePlaying = (roomId, key, status) => {
  let ref = firebase.database().ref("rooms/" + roomId + "/songs/" + key);
  ref.update({
    playing: status,
  });
};

firebase.syncPlayer = (roomId, key, player) => {
  let ref = firebase.database().ref("rooms/" + roomId + "/songs/" + key);
  if (ref) {
    ref.once("value").then((snapshot) => {
      if (snapshot && snapshot.toJSON()) {
        let currProg = snapshot.toJSON().progress;
        player.seekTo(Math.floor(currProg), false);
      }
    });
  }
};

firebase.updateProgress = (roomId, key, player) => {
  firebase
    .database()
    .ref("rooms/" + roomId + "/songs/" + key)
    .update({
      progress: player.getCurrentTime(),
    });
};

firebase.removePlaying = (roomId, key) => {
  let username;
  let songref = firebase
    .database()
    .ref("rooms/" + roomId + "/songs")
    .child(key);
  songref.once("value").then((snapshot) => {
    username = snapshot.val().addedBy;
    firebase
      .database()
      .ref("rooms/" + roomId + "/users")
      .orderByChild("nickname")
      .equalTo(username)
      .once("value")
      .then((snapshot) => {
        snapshot.forEach((user) => {
          console.log(user.val());
          firebase.decrementUserQueueCount(roomId, user.key);
        });
      });
  });
  songref.remove();
};

firebase.removeUpvote = (roomId, song, user) => {
  firebase
    .database()
    .ref("rooms/" + roomId + "/songs/" + song.key + "/votedUsers/")
    .child(user.nickname)
    .remove();
};

firebase.downvoteToUpvote = (roomId, song, user) => {
  firebase
    .database()
    .ref(
      "rooms/" + roomId + "/songs/" + song.key + "/votedUsers/" + user.nickname
    )
    .child("vote")
    .set(1);
};

firebase.addUpvote = (roomId, song, user) => {
  firebase
    .database()
    .ref(
      "rooms/" + roomId + "/songs/" + song.key + "/votedUsers/" + user.nickname
    )
    .update({ vote: 1 });
};

firebase.removeDownvote = (roomId, song, user) => {
  firebase
    .database()
    .ref("rooms/" + roomId + "/songs/" + song.key + "/votedUsers/")
    .child(user.nickname)
    .remove();
};

firebase.upvoteToDownvote = (roomId, song, user) => {
  firebase
    .database()
    .ref(
      "rooms/" + roomId + "/songs/" + song.key + "/votedUsers/" + user.nickname
    )
    .child("vote")
    .set(-1);
};

firebase.addDownvote = (roomId, song, user) => {
  firebase
    .database()
    .ref(
      "rooms/" + roomId + "/songs/" + song.key + "/votedUsers/" + user.nickname
    )
    .update({ vote: -1 });
};

firebase.changePosition = (song, roomId, change) => {
  firebase
    .database()
    .ref("rooms/" + roomId + "/songs")
    .child(song.key)
    .once("value")
    .then(function (snapshot) {
      let p = snapshot.child("position").val() + change;
      firebase
        .database()
        .ref("rooms/" + roomId + "/songs")
        .child(song.key)
        .child("position")
        .set(p);
      let r = snapshot.child("rating").val() + change;
      firebase
        .database()
        .ref("rooms/" + roomId + "/songs")
        .child(song.key)
        .child("rating")
        .set(r);
    });
};

firebase.removeSong = (roomId, song, userid) => {
  let firebaseRef = firebase.database().ref("rooms/" + roomId + "/songs");
  firebaseRef
    .orderByKey()
    .once("value")
    .then((snapshot) => {
      // Grab the current value of what was written to the Realtime Database.
      let found = false;
      snapshot.forEach((child) => {
        if (child.key === song.key) {
          found = true;
        } else if (found) {
          let p = child.val().position + 1;
          firebase
            .database()
            .ref("rooms/" + roomId + "/songs")
            .child(child.key)
            .child("position")
            .set(p);
        }
      });

      firebase
        .database()
        .ref("rooms/" + roomId + "/songs/" + song.key)
        .remove();
      firebase
        .database()
        .ref("rooms/" + roomId + "/currentPosition")
        .once("value", function (snapshot) {
          let pos = snapshot.val();
          firebase
            .database()
            .ref("rooms/" + roomId + "/currentPosition")
            .set(pos + 1);
        });
    });
  firebase.decrementUserQueueCount(roomId, userid);
};

firebase.createRoom = async (user) => {
  let roomKey = firebase.database().ref("rooms/").push().key;
  return firebase
    .database()
    .ref("rooms/" + roomKey + "/")
    .set({
      creator: user.nickname,
      roomNickname: roomKey,
    })
    .then(() => roomKey);
};

firebase.getRooms = () => {
  return firebase.database().ref("rooms").once("value");
};

firebase.changeNickname = (roomnickname, roomId) => {
  firebase
    .database()
    .ref("rooms/" + roomId)
    .child("roomNickname")
    .set(roomnickname + " (roomid:" + roomId + ")");
};

firebase.updateNickname = (roomId) => {
  let ref = firebase.database().ref("rooms/" + roomId);
  var nickname = "";
  if (ref) {
    ref.once("value").then((snapshot) => {
      nickname = snapshot.child("roomNickname").val();
    });
  }
  return nickname;
};

firebase.incrementUserQueueCount = (roomId, userid) => {
  let user = firebase
    .database()
    .ref("rooms/" + roomId + "/users")
    .child(userid);
  let numQueued;
  user.once("value").then((snapshot) => {
    numQueued = snapshot.val().queued;
    user.update({
      queued: numQueued + 1,
    });
  });
};

firebase.decrementUserQueueCount = (roomId, userid) => {
  let user = firebase
    .database()
    .ref("rooms/" + roomId + "/users")
    .child(userid);
  let numQueued;
  user.once("value").then((snapshot) => {
    numQueued = snapshot.val().queued;
    user.update({
      queued: numQueued - 1,
    });
    console.log(userid + ", " + numQueued);
  });
};

firebase.getUserQueueCount = (roomId, userid) => {
  let user = firebase
    .database()
    .ref("rooms/" + roomId + "/users")
    .child(userid);
  let numQueued;
  return user.once("value");
};

firebase.getUserCount = (roomId) => {
  return firebase
    .database()
    .ref("rooms/" + roomId + "/users")
    .once("value");
};

export default firebase;
