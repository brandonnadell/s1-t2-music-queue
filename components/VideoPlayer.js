import ReactPlayer from "react-player";
import Button from "react-bootstrap/Button";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import firebase from "../helpers/firebase";

export function VideoPlayer(props) {
  let queue = props.queue;
  let list = props.list[0];
  let url = "";
  let title = "";
  let img = "";
  let roomId = props.roomId;
  let data = {}
  let key = ""
  if (list && list.length !== 0) {
    data = list.val;
    key = list.key;
    url = data.videoUrl;
    title = data.title;
    img = data.image;
  }
  let muted = props.muted;
  const [player, setPlayer] = useState("");
  const [playing, setPlaying] = useState("");
  const [progress, setProgress] = useState("");
  const [started, setStarted] = useState("");

  const divStyle = {
    display: "flex",
    alignItems: "top",
    padding: "20px",
    width: "800px",
  };

  function handleToggle() {
    if (player.getSecondsLoaded() != null) {
      if (player.getInternalPlayer().getPlayerState() == 1) {
        player.getInternalPlayer().pauseVideo();
        setPlaying(false);
      } else {
        player.getInternalPlayer().playVideo();
        setPlaying(true);
      }
    }
  }

  function handleStart() {
    setPlaying(true);
    setStarted(true);
  }

  function handleReady() {
    setStarted(false);
  }

  function handleProgress() {
    setProgress((player.getCurrentTime() / player.getDuration()) * 100);
  }

  function handleSkipToEnd() {
    player.seekTo(player.getDuration() - 3, "seconds");
  }

  function handleEnded() {
    props.list.shift();
    firebase.database().ref("rooms/" + roomId + "/songs/").child(key).remove();
    setStarted(false);
  }

  function initPlayer(player) {
    setPlayer(player);
  }

  console.log("data.progress-------->", data.progress)
  console.log("props.list-------->", props.list)
  return (
    <div>
      {props.list && props.list.length !== 0 ? (
        <div style={divStyle}>
          <div>
            <Card style={{ width: "18rem" }}>
              <Card.Img variant="top" src={img} />
              {started ? (
                <Card.Body>
                  <div>
                    <div>
                      <Button variant="outline-primary" onClick={handleToggle}>
                        {playing ? "Pause" : "Play"}
                      </Button>
                    </div>
                    <div>
                      {playing ? "Playing" : "Paused"}: {title}
                    </div>
                    <div>
                      <ProgressBar now={progress} />
                    </div>
                    <div>
                      <Button
                        variant="outline-primary"
                        onClick={handleSkipToEnd}
                      >
                        Skip to End
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              ) : (
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                )}
            </Card>
          </div>
          <div>
            {props.list.length > 1 ? (
              <Card style={{ 'width': '165%' }}>
                <Card.Header as="h5">Queue</Card.Header>
                <Table striped>
                  <thead style={{ 'display': 'table', 'width': '100%', 'table-layout': 'fixed' }}>
                    <tr>
                      <th></th>
                      <th>Song</th>
                      <th>Rating</th>
                      <th><center>Vote</center></th>
                      <th>Added By</th>
                    </tr>
                  </thead>
                  <tbody style={{ 'height': '277px', 'overflow': 'scroll', 'display': 'block' }}>
                    {props.list
                      .slice(1, props.list.length)
                      .map((song, ind) => (
                        <tr key={song.val.title} style={{ 'display': 'table', 'width': '100%', 'table-layout': 'fixed' }}>
                          <td>{ind + 1}</td>
                          <td>{song.val.title}</td>
                          <td>{song.val.rating}</td>
                          <td>
                            {/* <ButtonToolbar> */}
                            <Button
                              variant="outline-success"
                              size="sm"
                              block

                            >
                              Upvote
                              </Button>
                            <div>
                              <center></center>
                            </div>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              block
                            >
                              Downvote
                              </Button>
                            {/* </ButtonToolbar> */}
                          </td>
                          <td>
                            {song.val.addedBy}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              </Card>
            ) : (
                <div></div>
              )}
          </div>
        </div>
      ) : (
          <div></div>
        )}
      <ReactPlayer
        url={url}
        key={key}
        controls={true}
        pip={false}
        playing={true}
        muted={muted}
        width={0}
        height={0}
        ref={initPlayer}
        onStart={handleStart}
        onProgress={handleProgress}
        onReady={handleReady}
        onEnded={handleEnded}
        config={{
          youtube: {
            playerVars: { disablekb: 1, autoplay: 1, start: data.progress },
          },
        }}
      />
    </div>
  );
}
export default VideoPlayer;