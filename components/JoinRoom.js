import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Router from "next/router";
import firebase from "../helpers/firebase";
import FormControl from "react-bootstrap/FormControl";
import React, { useState, useEffect } from "react";

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState(false);

  function join() {
    firebase
      .database()
      .ref("rooms")
      .once("value")
      .then((res) => {
        console.log({ roomId });
        if (roomId && res.hasChild(roomId)) {
          Router.push("/room/" + roomId);
        } else {
          setError(true);
        }
      });
  }

  return (
    <div>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Enter a Room ID"
          aria-label="Enter a Room ID"
          aria-describedby="basic-addon2"
          onChange={(e) => setRoomId(e.target.value)}
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
    </div>
  );
};

export default JoinRoom;
