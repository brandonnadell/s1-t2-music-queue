import Button from "react-bootstrap/Button";
import Router from "next/router";

export default function CreateRoom(props) {
  async function redirect() {
    const roomId = 1;
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ creator: props.user.given_name }),
    });
    console.log(res.body);
    /* Router.push("/room/" + res.id)*/
  }

  return <Button onClick={() => redirect()}>Create Room</Button>;
}
