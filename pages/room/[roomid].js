import { useRouter } from "next/router";
import AppNavBar from "../../components/AppNavbar";
import AppFooter from "../../components/AppFooter";
import SearchBar from "../../components/SearchBar";
import VideoPlayer from "../../components/VideoPlayer";
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { requiredAuth } from "../../utils/ssr";
import firebase from "../../helpers/firebase";

export const getServerSideProps = requiredAuth;

const Room = (props) => {
  const router = useRouter();
  const { roomid } = router.query;
  const [list, setList] = useState([]);
  const user = props.user;
  let userid;
  let firebaseRef;
  let roomRef;

  useEffect(() => {
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
        }
      });

    roomRef = firebase.database().ref("rooms/" + roomid);

    userid = roomRef.child("/users").push(user).key;
    firebaseRef = firebase.database().ref("rooms/" + roomid + "/songs");
    firebaseRef.on("value", (snapshot) => {
      // Grab the current value of what was written to the Realtime Database.
      const tempList = [];
      snapshot.forEach((child) => {
        tempList.push({ key: child.key, val: child.val() });
      });
      setList(tempList);
    });
    window.addEventListener("beforeunload", function (event) {
      roomRef.child("users/" + userid).remove();
    });

    // return a cleanup function that will get called by React on unmount
    return () => {
      firebaseRef.off();
    };
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
          <VideoPlayer list={list} muted={false} roomId={roomid} user={user} />
        </div>
      </div>
    </Layout>
  );
};

export default Room;
