import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { optionalAuth } from "../utils/ssr";
import SearchBar from "../components/SearchBar";
import CreateRoom from "../components/CreateRoom";

export const getServerSideProps = optionalAuth;

function HomePage(props) {
  const user = props.user;
  const [queue, setQueue] = useState([]);
  const [titles, setTitles] = useState([]);
  const [imgs, setImgs] = useState([]);

  function handleUrlClick(vidUrl, vidTitle, vidImg) {
    setQueue(queue.concat(vidUrl));
    setTitles(titles.concat(vidTitle));
    setImgs(imgs.concat(vidImg));
  }

  return (
    <Layout user={user}>
      {user ? (
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
          <CreateRoom user={user}></CreateRoom>
        </div>
      ) : (
          <div>You're not logged in!</div>
        )}
    </Layout>
  );
}

export default HomePage;
