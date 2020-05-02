import Button from "react-bootstrap/Button";
import Router from "next/router";

const CreateRoom = () => {
  function redirect() {
    const room = getServerSideProps().props;
    if (room) {
      console.log(room?.id);
      /* Router.push("/room/${room.id}") */
    } else {
      throw {
        status: 404,
        message: "Room not found",
      };
    }
  }

  async function getServerSideProps() {
    // Fetch data from external API
    const res = await fetch("/api/createRoom");

    // Pass data to the page via props
    return { props: { res } };
  }
  return <Button onClick={() => redirect()}>Create Room</Button>;
};

export default CreateRoom;
