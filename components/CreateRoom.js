import Button from "react-bootstrap/Button";
import Router from "next/router";

export default function CreateRoom(props) {
  async function redirect() {
    const roomId = await props.database.createRoom(props.user);
    Router.push("/room/" + roomId);
  }

  return <Button onClick={() => redirect()}>Create Room</Button>;
}
