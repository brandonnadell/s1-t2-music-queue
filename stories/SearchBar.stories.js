import React from "react";
import SearchBar from "../components/SearchBar";
import database from "./database";

export default {
  title: "SearchBar",
  component: SearchBar,
};

export const searchbar = () => {
  const user = {
    key: "FKJLASFLKJS",
    val: {
      name: "Yuval Steinhart",
      nickname: "yuval",
      picture: "https://avatars3.githubusercontent.com/ySteinhart1",
    },
  };
  return (
    <SearchBar
      roomId={"AAAA"}
      user={user}
      database={database}
      fetchData={fetchData}
    />
  );
};

async function fetchData(url) {
  const song = [
    {
      snippet: {
        title: "Runaway",
        channelTitle: "Kanye West",
        thumbnails: {
          high: {
            url:
              "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DL7_jYl8A73g&psig=AOvVaw3AN4BRUaorlA625d2EpSbt&ust=1590519375709000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCODk08XYz-kCFQAAAAAdAAAAABAD",
          },
        },
      },
      videoId: "ABCD",
    },
  ];
  return song;
}
