import React from "react";
import { select, text } from "@storybook/addon-knobs";
import AppNavbar from "../components/AppNavbar";
import database from "./database";

export default {
  title: "AppNavbar",
  component: AppNavbar,
};

export const loggedOut = () => {
  return <AppNavbar />;
};

export const loggedIn = () => {
  const name = text("Name", "Yuval Steinhart");
  const nickname = text("Nickname", "yuval");
  const picture = text(
    "Image URL",
    "https://avatars3.githubusercontent.com/ySteinhart1"
  );
  const user = { name, nickname, picture };
  return <AppNavbar user={user} database={database} />;
};
