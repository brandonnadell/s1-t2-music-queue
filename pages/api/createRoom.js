import { ObjectId } from "mongodb";
import { initDatabase } from "../../utils/mongodb";

export default async function createRoom(user) {
  let newRoom;

  const client = await initDatabase();
  const rooms = client.collection("rooms");

  newRoom = {
    creator: user._id,
    users: [user._id],
  };

  await rooms.insertOne(newRoom);

  return newRoom;
}
