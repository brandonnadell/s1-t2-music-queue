import React from "react";
import JoinRoom from "../components/JoinRoom";
import database from "./database";

export default {
  title: "JoinRoom",
  component: JoinRoom,
};

export const joinroom = () => {
  const user = {
    name: "Yuval Steinhart",
    nickname: "yuval",
    picture: "https://avatars3.githubusercontent.com/ySteinhart1",
  };
  return <JoinRoom user={user} database={database} />;
};
