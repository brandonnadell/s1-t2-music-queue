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
  const [list, setList] = useState([])
  const user = props.user;
  let firebaseRef;

  useEffect(() => {
    firebaseRef = firebase.database().ref("rooms/" + roomid + "/songs");
    firebaseRef.on("value", (snapshot) => {
      // Grab the current value of what was written to the Realtime Database.
      const tempList = [];
      snapshot.forEach(child => {
        tempList.push({ key: child.key, val: child.val() })
      })
      setList(tempList);
    });
    // return a cleanup function that will get called by React on unmount
    return () => {
      firebaseRef.off()
    }
  }, [])

  return (
    <Layout user={user}>
      <p>Room: {roomid}</p>
      <div>
        <div>
          <SearchBar roomId={roomid} />
        </div>
        <div>
          {/* {console.log("sonng list object: ", list)} */}
          <VideoPlayer
            list={list}
            muted={false}
            roomId={roomid}
            user={user}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Room;
