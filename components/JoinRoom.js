import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Router from "next/router";
import FormControl from "react-bootstrap/FormControl";
import React, { useState, useEffect } from "react";
import firebase from "../client/firebase";

const JoinRoom = (props) => {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState(false);
  const [invalidId, setInvalidId] = useState(false);

  async function join() {
    let banned = [];
    let isBan = false;
    let roomRef = props.database
      .database()
      .ref("rooms/" + roomId + "/bannedUsers");
    await roomRef.once("value").then((snapshot) => {
      snapshot.forEach((child) => {
        banned.push(child.val().val.nickname);
        if (props.user.nickname === child.val().val.nickname) {
          window.alert(
            "You are banned from joining this room! Try a different room or create your own room."
          );
          isBan = true;
          // Router.push("/");
        }
      });
    });
    props.database
      .getRooms()
      .then((res) => {
        if (res?.hasChild(roomId) && !isBan) {
          Router.push("/room/" + roomId);
        } else {
          if (!isBan) {
            setError(true);
            setInvalidId(false);
          }
        }
      })
      .catch((err) => {
        setInvalidId(true);
        setError(false);
      });
  }

  function handleKeyPress(key) {
    if (key === "Enter") {
      join();
    }
  }

  return (
    <div className="joinRoom">
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Enter a Room ID"
          aria-label="Enter a Room ID"
          aria-describedby="basic-addon2"
          onChange={(e) => setRoomId(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e.key)}
        />
        <InputGroup.Append>
          <Button variant="outline-dark" onClick={() => join()}>
            Join Room
          </Button>
        </InputGroup.Append>
      </InputGroup>
      {error ? (
        <p> No room with that ID could be found. Please try again</p>
      ) : (
        <p></p>
      )}
      {invalidId ? <p>Invalid ID, please try a different one</p> : <p></p>}
      <style jsx>{`
        .joinRoom {
          position: absolute;
          top: 700px;
          left: 550px;
        }
      `}</style>
    </div>
  );
};

export default JoinRoom;
