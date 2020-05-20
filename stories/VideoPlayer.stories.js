import React, { useState, useEffect } from "react";
import VideoPlayer from "../components/VideoPlayer";
import database from "./database";

export default {
  title: "VideoPlayer",
  component: VideoPlayer,
};

export const videoplayer = () => {
  const user = {
    name: "Yuval Steinhart",
    nickname: "yuval",
    picture: "https://avatars3.githubusercontent.com/ySteinhart1",
  };
  let [list, setList] = useState([]);
  setList([
    {
      val: {
        artist: "kanye west",
        title: "Runaway",
        videoUrl: "https://www.youtube.com/watch?v=Bm5iA4Zupek",
      },
      key: "GJDSJKDS",
    },
  ]);

  return (
    <VideoPlayer
      list={list}
      muted={false}
      roomId={"AAAA"}
      user={user}
      database={database}
      admin={user.nickname}
    />
  );
};
