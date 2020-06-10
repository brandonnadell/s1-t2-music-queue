import React, { useState, useEffect } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import FormControl from "react-bootstrap/FormControl";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";

var songs = [];
// var maxResults;
var songId = 0;

const SearchBar = (props) => {
  const database = props.database;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCount, setSearchCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [moreResultsCount, setMoreResultsCount] = useState(0);
  const [error, setError] = useState("");
  const [data, setData] = useState("");
  let roomId = props.roomId;
  const fetchData = props.fetchData;

  useEffect(() => {
    console.log("ran use effect--->", searchTerm);
    console.log("ran use effect data--->", data);
    console.log("ran use effect count--->", searchCount);

    if (searchTerm.length !== 0) {
      setLoading(true);
      // maxResults = 3;
      fetchData(searchTerm).then((res) => {
        setData(res);
        setLoading(false);
      });
    }
  }, [searchCount]);

  // function displayAllResults(param) {
  //   setMoreResultsCount(moreResultsCount + 1);
  //   maxResults = param;
  // }

  SearchBar.getSongs = () => {
    return songs;
  };

  SearchBar.setSearchCount = (num) => {
    console.log("count--->", searchCount);
    setSearchCount(num);
    console.log("ran search count searchbar function.---->", num);
  };
  SearchBar.setData = (data) => {
    setData(data);
    console.log("ran data searchbar function.-->", data);
  };
  SearchBar.setSearchTerm = (term) => {
    setSearchTerm(term);
    console.log("ran search term searchbar function.---->", term);
  };

  function queueSong(song) {
    database.getUserCount(roomId).then((users) => {
      let userCount = users.numChildren();
      let maxQueueSize = Math.ceil(20 / userCount);
      database.getUserQueueCount(roomId, props.userid).then((snapshot) => {
        if (snapshot.val().queued >= maxQueueSize) {
          window.alert(
            "You have reached your queue limit. Wait for songs to get off the queue before queuing more!"
          );
        } else {
          database.createSong(
            song.videoId,
            song.title,
            song.img,
            roomId,
            props.user.nickname
          );
          database.incrementUserQueueCount(roomId, props.userid);
        }
      });
    });
  }

  function handleKeyPress(key) {
    if (key === "Enter") {
      setSearchCount(searchCount + 1);
    }
  }

  // if (searchTerm.length !== 0) {
  songs = (data.items || []).map((song) => {
    return {
      title: song.snippet.title
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/&#39;/g, "'"),
      artist: song.snippet.channelTitle,
      img: song.snippet.thumbnails.high.url,
      videoId: song.id.videoId,
    };
  });
  if (songs.length === 0 && props.songCache.length !== 0)
    songs = props.songCache;
  // }

  return (
    <div style={{ height: "100%" }}>
      {/* <InputGroup className="mb-3">
        <FormControl
          placeholder="Search for music..."
          aria-label="Search for music..."
          aria-describedby="basic-addon2"
          onChange={(e) => {
            if (e.target.value === '') {
              setData([]);
            }
            setSearchTerm(e.target.value)
          }}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e.key)}
        />
        <InputGroup.Append>
          <Button
            variant="outline-dark"
            onClick={() => setSearchCount(searchCount + 1)}
          >
            Search
          </Button>
        </InputGroup.Append>
      </InputGroup> */}
      {data.error && (
        <Alert variant="danger">
          <Alert.Heading>
            Oh snap! There was an error with the API response!
          </Alert.Heading>
          <p>{data.error.errors[0].message}</p>
        </Alert>
      )}
      {songs.length > 0 ? (
        <Card>
          {/* <Card.Header as="h5">Results</Card.Header> */}
          {loading === true ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : (
            <div>
              {/* <Table hover variant="light"> */}
              <tbody>
                {songs &&
                  songs.slice(0, songs.length).map((song, ind) => (
                    <tr key={song.title}>
                      <td style={{ width: "15%" }}>
                        <Button
                          variant="outline-success"
                          onClick={() => queueSong(song)}
                        >
                          Queue
                        </Button>
                      </td>
                      <td style={{ width: "65%" }}>
                        <Image
                          className="img-responsive"
                          src={song.img}
                          height="40"
                          width="40"
                          rounded
                        />{" "}
                        {song.title}
                      </td>
                      <td style={{ width: "20%" }}>{song.artist}</td>
                    </tr>
                  ))}
              </tbody>
              {/* </Table> */}
            </div>
          )}
        </Card>
      ) : (
        <center style={{ height: "100%" }}>
          <Alert style={{ height: "100%", padding: "12%" }} variant="primary">
            <Alert.Heading>Search results will show up here.</Alert.Heading>
            <div style={{ fontStyle: "italic" }}>
              Search for a song/artist you want to hear in the field above and
              then hit 'Search' or enter. Once results are queried, you can hide
              the results by clearing the input field.
            </div>
          </Alert>
        </center>
      )}
    </div>
  );
};
export default SearchBar;
