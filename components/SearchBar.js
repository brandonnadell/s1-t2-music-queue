import React, { useState, useEffect } from "react";
import { fetchData } from "../utils/youtube_api";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import FormControl from "react-bootstrap/FormControl";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";

var songs = [];
var maxResults;
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

  useEffect(() => {
    if (searchTerm.length !== 0) {
      setLoading(true);
      maxResults = 3;
      fetchData(searchTerm).then((res) => {
        setData(res);
        setLoading(false);
      });
    }
  }, [searchCount]);

  function displayAllResults(param) {
    setMoreResultsCount(moreResultsCount + 1);
    maxResults = param;
  }

  if (searchTerm.length !== 0) {
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
  }

  return (
    <div>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search for music..."
          aria-label="Search for music..."
          aria-describedby="basic-addon2"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputGroup.Append>
          <Button
            variant="outline-dark"
            onClick={() => setSearchCount(searchCount + 1)}
          >
            Search
          </Button>
        </InputGroup.Append>
      </InputGroup>
      {data.error && (
        <Alert variant="danger">
          <Alert.Heading>
            Oh snap! There was an error with the API response!
          </Alert.Heading>
          <p>{data.error.errors[0].message}</p>
        </Alert>
      )}
      {songs.length > 0 && (
        <Card>
          <Card.Header as="h5">Results</Card.Header>
          {loading === true ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : (
            <div>
              <Table hover variant="light">
                <thead>
                  <tr>
                    <th></th>
                    <th>Title</th>
                    <th>Artist</th>
                  </tr>
                </thead>
                <tbody>
                  {songs &&
                    songs.slice(0, maxResults).map((song, ind) => (
                      <tr key={song.title}>
                        <td>
                          <Button
                            variant="outline-success"
                            onClick={() =>
                              database.createSong(
                                song.videoId,
                                song.title,
                                song.img,
                                roomId,
                                props.user.nickname
                              )
                            }
                          >
                            Queue
                          </Button>
                        </td>
                        <td>
                          <Image
                            className="img-responsive"
                            src={song.img}
                            height="40"
                            width="40"
                            rounded
                          />{" "}
                          {song.title}
                        </td>
                        <td>{song.artist}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
              <Card.Footer>
                {maxResults === 3 ? (
                  <Button
                    onClick={() => displayAllResults(10)}
                    variant="outline-dark"
                  >
                    Show More Results
                  </Button>
                ) : (
                  <Button
                    onClick={() => displayAllResults(3)}
                    variant="outline-dark"
                  >
                    Show Less Results
                  </Button>
                )}
              </Card.Footer>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
export default SearchBar;
