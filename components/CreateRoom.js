import Button from "react-bootstrap/Button";
import Router from "next/router";
import firebase from "../helpers/firebase"

export default function CreateRoom(props) {
  async function redirect() {
    let roomKey = firebase.database().ref("rooms/").push().key;
    firebase.database().ref("rooms/" + roomKey + "/").set({
      creator: props.user.nickname
    })
    Router.push("/room/" + roomKey)
  }

  return <Button onClick={() => redirect()}>Create Room</Button>;
}
