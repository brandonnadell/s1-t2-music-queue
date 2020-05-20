import { useRouter } from "next/router";
import AppNavBar from "../../components/AppNavbar";
import AppFooter from "../../components/AppFooter";
import SearchBar from "../../components/SearchBar";
import VideoPlayer from "../../components/VideoPlayer";
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { requiredAuth } from "../../utils/ssr";
import firebase from "../../client/firebase";

export const getServerSideProps = requiredAuth;

const Room = (props) => {
  const router = useRouter();
  const { roomid } = router.query;
  const [list, setList] = useState([]);
  const [admin, setAdmin] = useState("");
  const user = props.user;
  let userid;
  let firebaseRef;
  let roomRef;
  let creator;

  useEffect(() => {
    try {
      firebase
        .database()
        .ref("rooms")
        .child(roomid)
        .once("value")
        .then((res) => {
          if (!res.hasChild("creator")) {
            router.push("/");
            firebase
              .database()
              .ref("rooms/" + roomid)
              .remove();
          } else {
            roomRef.on("value", (snapshot) => {
              creator = snapshot.val().creator;
              setAdmin(creator);
            });
          }
        });

      roomRef = firebase.database().ref("rooms/" + roomid);
      roomRef
        .child("users")
        .once("value")
        .then((snapshot) => {
          let users = [];
          snapshot.forEach((entry) => {
            users.push(entry.val().nickname);
          });
          console.log(users);
          if (!users.includes(user.nickname)) {
            userid = roomRef.child("/users").push(user).key;
          } else {
            router.push("/");
          }
        });

      firebaseRef = firebase.database().ref("rooms/" + roomid + "/songs");
      firebaseRef.orderByChild("position").on("value", (snapshot) => {
        // Grab the current value of what was written to the Realtime Database.
        const tempList = [];
        snapshot.forEach((child) => {
          tempList.push({ key: child.key, val: child.val() });
        });
        // Set first song to largest position so that doesn't get moved from the front
        if (tempList.length > 0)
          firebase
            .database()
            .ref("rooms/" + roomid + "/songs/")
            .child(tempList[tempList.length - 1].key)
            .child("position")
            .set(Number.MAX_VALUE);
        setList(tempList.reverse());
      });

      window.addEventListener("beforeunload", function (event) {
        roomRef.child("users/" + userid).remove();
        roomRef.once("value").then((res) => {
          if (res.hasChild("users")) {
            if (creator == user.nickname) {
              roomRef
                .child("users")
                .limitToFirst(1)

                .once("value")
                .then((snapshot) => {
                  snapshot.forEach((u) => {
                    creator = u.val().nickname;
                  });
                  roomRef.child("creator").set(creator);
                  setAdmin(creator);
                  console.log(tmp);
                  console.log(creator);
                });
            }
          } else {
            roomRef.child("creator").set(null);
            roomRef.remove();
            setAdmin("");
          }
        });
      });

      // return a cleanup function that will get called by React on unmount
      return () => {
        firebaseRef.off();
      };
    } catch (err) {
      router.push("/");
    }
  }, []);

  return (
    <Layout user={user}>
      <p>Room: {roomid}</p>
      <div>
        <div>
          <SearchBar roomId={roomid} user={user} />
        </div>
        <div>
          {/* {console.log("song list object: ", list)} */}
          <VideoPlayer
            list={list}
            muted={false}
            roomId={roomid}
            user={user}
            admin={admin}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Room;
