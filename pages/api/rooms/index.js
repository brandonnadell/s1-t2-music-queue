import { authenticatedAction } from "../../../utils/api";
import { initDatabase } from "../../../utils/mongodb";

export async function getRooms() {
  const client = await initDatabase();
  const rooms = client.collection("rooms");

  return rooms.toArray();
}

async function createRoom(req) {
  const { creator } = req.body;

  if (!creator) {
    throw {
      status: 400,
      message: "Missing creator",
    };
  }

  const client = await initDatabase();
  const rooms = client.collection("rooms");

  const query = {
    creator,
  };

  const result = await rooms.insertOne(query);

  return result.insertedId;
}

async function performAction(req, user) {
  switch (req.method) {
    case "GET":
      return getRooms();
    case "POST":
      return createRoom(req);
  }

  throw { status: 405 };
}

export default authenticatedAction(performAction);
