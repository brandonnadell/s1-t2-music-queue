import { useRouter } from "next/router";
import AppNavBar from "../../components/AppNavbar";
import AppFooter from "../../components/AppFooter";
import SearchBar from "../../components/SearchBar";
import VideoPlayer from "../../components/VideoPlayer";
import DisplayRoom from "../../components/DisplayRoom";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Layout from "../../components/Layout";
import { requiredAuth } from "../../utils/ssr";
import firebase from "../../client/firebase";
import { fetchData } from "../../utils/youtube_api";
import Button from "react-bootstrap/Button";

export const getServerSideProps = requiredAuth;

const Room = (props) => {
  const router = useRouter();
  const { roomid } = router.query;
  const [list, setList] = useState([]);
  const [admin, setAdmin] = useState("");
  const [roomnickname, setRoomNickname] = useState("");
  const user = props.user;
  let userid;
  let firebaseRef;
  let roomRef;
  let creator;

  useEffect(() => {
    try {
      // REMOVE ROOM IF IT DOESNT HAVE CREATOR
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
            console.log("res---->", res);
            roomRef.on("value", (snapshot) => {
              creator = (snapshot.val() && snapshot.val().creator) || "";
              setAdmin(creator);
            });
          }
        });

      // BAN USER IF BANNED FROM ROOM
      let banned = [];
      roomRef = firebase.database().ref("rooms/" + roomid);
      roomRef
        .child("bannedUsers")
        .once("value")
        .then((snapshot) => {
          snapshot.forEach((child) => {
            banned.push(child.val().val.nickname);
            if (user.nickname === child.val().val.nickname) {
              window.alert(
                "You are banned from joining this room! Try a different room or create your own room."
              );
              router.push("/");
            }
          });
        });

      // console.log('banned users---->s', banned)

      // ADD USER TO ROOM
      roomRef
        .child("users")
        .once("value")
        .then((snapshot) => {
          let users = [];
          snapshot.forEach((entry) => {
            users.push(entry.val().nickname);
          });
          // console.log(users);
          if (
            !users.includes(user.nickname) &&
            !banned.includes(user.nickname)
          ) {
            // console.log('why is it runnning this???')
            userid = roomRef.child("/users").push(user).key;
          } else {
            // console.log("got pushed back to home page")
            router.push("/");
          }
        });

      // GET DB SONGS AND ADD TO CLIENT ROOM
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

      // GET AONTHER USER TO MAKE ADMIN, OTHERWISE DELETE

      window.addEventListener("beforeunload", (event) => {
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

  useEffect(() => {
    var roomRef = firebase.database().ref("rooms/" + roomid);
    roomRef.on("value", (snapshot) => {
      var nickname = "";
      nickname = snapshot.child("roomNickname").val();

      setRoomNickname(nickname);
    });
  });

  return (
    <Layout user={user}>
      <div style={{ display: "flex" }}>
        <p style={{ marginTop: "15px" }}>Room: {roomnickname}</p>
        <CopyToClipboard text={roomid}>
          <Button
            style={{
              marginTop: "10px",
              marginBottom: "10px",
              marginLeft: "10px",
            }}
            variant="outline-dark"
          >
            Copy Roomid
          </Button>
        </CopyToClipboard>
      </div>
      <div
        style={{ maxWidth: "400px", marginTop: "10px", marginBottom: "10px" }}
      >
        <DisplayRoom
          roomId={roomid}
          database={firebase}
          user={user}
          admin={admin}
        />
      </div>

      <div>
        <div>
          <VideoPlayer
            list={list}
            roomId={roomid}
            user={user}
            admin={admin}
            database={firebase}
            fetchData={fetchData}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Room;
