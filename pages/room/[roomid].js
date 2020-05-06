import { useRouter } from "next/router";
import AppNavBar from "../../components/AppNavbar";
import AppFooter from "../../components/AppFooter";
import SearchBar from "../../components/SearchBar";
import VideoPlayer from "../../components/VideoPlayer";
import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { requiredAuth } from "../../utils/ssr";

export const getServerSideProps = requiredAuth;

const Room = (props) => {
  const router = useRouter();
  const { roomid } = router.query;
  const [queue, setQueue] = useState([]);
  const [titles, setTitles] = useState([]);
  const [imgs, setImgs] = useState([]);
  const user = props.user;

  function handleUrlClick(vidUrl, vidTitle, vidImg) {
    setQueue(queue.concat(vidUrl));
    setTitles(titles.concat(vidTitle));
    setImgs(imgs.concat(vidImg));
  }

  return (
    <Layout user={user}>
      <p>Room: {roomid}</p>
      <div>
        <div>
          <SearchBar onUrlClick={handleUrlClick} />
        </div>
        <div>
          <VideoPlayer
            queue={queue}
            titles={titles}
            imgs={imgs}
            muted={false}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Room;
