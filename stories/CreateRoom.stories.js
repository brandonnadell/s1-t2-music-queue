import React from "react";
import { select, text } from "@storybook/addon-knobs";
import CreateRoom from "../components/CreateRoom";
import database from "./database";

export default {
  title: "CreateRoom",
  component: CreateRoom,
};

export const loggedIn = () => {
  const user = {
    name: "Yuval Steinhart",
    nickname: "yuval",
    picture: "https://avatars3.githubusercontent.com/ySteinhart1",
  };
  return <CreateRoom user={user} database={database} />;
};
