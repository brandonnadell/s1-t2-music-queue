import React from "react";
import { select, text } from "@storybook/addon-knobs";
import Layout from "../components/Layout";
import database from "./database";

export default {
  title: "Layout",
  component: Layout,
};

export const loggedOut = () => {
  return <Layout database={database} />;
};

export const loggedInWithChildren = () => {
  const content = text("Content", "Sample Content");
  const name = text("Name", "Yuval Steinhart");
  const nickname = text("Nickname", "yuval");
  const picture = text(
    "Image URL",
    "https://avatars3.githubusercontent.com/ySteinhart1"
  );
  const user = { name, nickname, picture };
  return <Layout user={user} database={database} children={content} />;
};
