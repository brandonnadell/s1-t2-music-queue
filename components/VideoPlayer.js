import ReactPlayer from "react-player";
import { CaretUpFill, CaretDownFill } from "react-bootstrap-icons";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
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
import firebase from "../client/firebase";

export function VideoPlayer(props) {
  let queue = props.queue;
  let list = props.list[0];
  let url = "";
  let title = "";
  let img = "";
  let roomId = props.roomId;
  let data = {};
  let key = "";
  let creator = props.admin;
  if (list && list.length !== 0) {
    data = list.val;
    key = list.key;
    url = data.videoUrl;
    title = data.title;
    img = data.image;
  }
  let muted = props.muted;
  const [player, setPlayer] = useState("");
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState("");
  const [started, setStarted] = useState("");

  useEffect(() => {
    if (
      creator !== props.user.nickname &&
      data &&
      data.playing !== playing &&
      player
    )
      handleToggle();
  });

  const divStyle = {
    display: "flex",
    alignItems: "top",
    padding: "20px",
    width: "800px",
  };

  function handleToggle() {
    let ref = firebase.database().ref("rooms/" + roomId + "/songs/" + key);
    if (player.getSecondsLoaded() != null) {
      if (player.getInternalPlayer().getPlayerState() == 1) {
        player.getInternalPlayer().pauseVideo();
        setPlaying(false);
        if (creator === props.user.nickname) {
          ref.update({
            playing: false,
          });
        }
      } else {
        player.getInternalPlayer().playVideo();
        setPlaying(true);
        if (creator === props.user.nickname) {
          ref.update({
            playing: true,
          });
        }
      }
    }
  }

  function handleStart() {
    setPlaying(true);
    setStarted(true);
    let ref = firebase.database().ref("rooms/" + roomId + "/songs/" + key);
    if (props.user.nickname !== creator) {
      if (ref) {
        ref.once("value").then((snapshot) => {
          if (snapshot && snapshot.toJSON()) {
            let currProg = snapshot.toJSON().progress;
            player.seekTo(Math.floor(currProg), false);
          }
        });
      }
    } else {
      if (data.progress !== 0) player.seekTo(data.progress, false);
      ref.update({
        playing: true,
      });
    }
  }

  function handleReady() {
    setStarted(false);
  }

  function handleProgress() {
    let currentProg = (player.getCurrentTime() / player.getDuration()) * 100;
    if (props.user.nickname === creator) {
      if (Math.abs(currentProg - data.progress) > 1) {
        firebase
          .database()
          .ref("rooms/" + roomId + "/songs/" + key)
          .update({
            progress: player.getCurrentTime(),
          });
      }
    }
    setProgress(setProgress(currentProg));
  }

  function handleSkipToEnd() {
    handleEnded();
  }

  function handleEnded() {
    if (creator == props.user.nickname)
      firebase
        .database()
        .ref("rooms/" + roomId + "/songs/")
        .child(key)
        .remove();
    setStarted(false);
  }

  function initPlayer(player) {
    setPlayer(player);
  }

  function changePosition(song, change) {
    firebase
      .database()
      .ref("rooms/" + roomId + "/songs")
      .child(song.key)
      .once("value")
      .then(function (snapshot) {
        let p = snapshot.child("position").val() + change;
        firebase
          .database()
          .ref("rooms/" + roomId + "/songs")
          .child(song.key)
          .child("position")
          .set(p);
        let r = snapshot.child("rating").val() + change;
        firebase
          .database()
          .ref("rooms/" + roomId + "/songs")
          .child(song.key)
          .child("rating")
          .set(r);
      });
  }

  function upvote(song) {
    if (
      song.val.votedUsers != null &&
      song.val.votedUsers[props.user.nickname] != null
    ) {
      let vote = song.val.votedUsers[props.user.nickname].vote;
      if (vote == 1) {
        firebase
          .database()
          .ref("rooms/" + roomId + "/songs/" + song.key + "/votedUsers/")
          .child(props.user.nickname)
          .remove();
        changePosition(song, -1);
      } else if (vote == -1) {
        firebase
          .database()
          .ref(
            "rooms/" +
              roomId +
              "/songs/" +
              song.key +
              "/votedUsers/" +
              props.user.nickname
          )
          .child("vote")
          .set(1);
        changePosition(song, 2);
      }
    } else {
      firebase
        .database()
        .ref(
          "rooms/" +
            roomId +
            "/songs/" +
            song.key +
            "/votedUsers/" +
            props.user.nickname
        )
        .update({ vote: 1 });
      changePosition(song, 1);
    }
  }

  function downvote(song) {
    if (
      song.val.votedUsers != null &&
      song.val.votedUsers[props.user.nickname] != null
    ) {
      let vote = song.val.votedUsers[props.user.nickname].vote;
      if (vote == -1) {
        firebase
          .database()
          .ref("rooms/" + roomId + "/songs/" + song.key + "/votedUsers/")
          .child(props.user.nickname)
          .remove();
        changePosition(song, 1);
      } else if (vote == 1) {
        firebase
          .database()
          .ref(
            "rooms/" +
              roomId +
              "/songs/" +
              song.key +
              "/votedUsers/" +
              props.user.nickname
          )
          .child("vote")
          .set(-1);
        changePosition(song, -2);
      }
    } else {
      firebase
        .database()
        .ref(
          "rooms/" +
            roomId +
            "/songs/" +
            song.key +
            "/votedUsers/" +
            props.user.nickname
        )
        .update({ vote: -1 });
      changePosition(song, -1);
    }
  }

  function getVote(song) {
    return song.val.votedUsers != null &&
      song.val.votedUsers[props.user.nickname] != null
      ? song.val.votedUsers[props.user.nickname].vote
      : 0;
  }

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
                      <div>
                        {playing ? "Playing" : "Paused"}: {title}
                      </div>
                      {props.user.nickname === creator ? (
                        <div>
                          <ButtonGroup aria-label="Song Options">
                            <Button
                              variant="outline-primary"
                              onClick={handleToggle}
                            >
                              {playing ? "Pause" : "Play"}
                            </Button>
                            <Button
                              variant="outline-primary"
                              onClick={handleSkipToEnd}
                            >
                              Skip
                            </Button>
                          </ButtonGroup>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>

                    <div>
                      <ProgressBar now={progress} />
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
              <Card style={{ width: "165%" }}>
                <Card.Header as="h5">Queue</Card.Header>
                <Table striped>
                  <thead
                    style={{
                      display: "table",
                      width: "100%",
                      tableLayout: "fixed",
                    }}
                  >
                    <tr>
                      <th></th>
                      <th>Song</th>
                      <th>Rating</th>
                      <th>Vote</th>
                      <th>Added By</th>
                    </tr>
                  </thead>
                  <tbody
                    style={{
                      height: "277px",
                      overflow: "scroll",
                      display: "block",
                    }}
                  >
                    {props.list.slice(1, props.list.length).map((song, ind) => (
                      <tr
                        key={song.title}
                        style={{
                          display: "table",
                          width: "100%",
                          tableLayout: "fixed",
                        }}
                      >
                        <td>{ind + 1}</td>
                        <td>{song.val.title}</td>
                        <td>{song.val.rating}</td>
                        <td>
                          {song.val.addedBy !== props.user.nickname ? (
                            <div>
                              <Button
                                variant={
                                  getVote(song) == 1
                                    ? "primary"
                                    : "outline-primary"
                                }
                                size="sm"
                                onClick={() => upvote(song)}
                              >
                                <CaretUpFill />
                              </Button>
                              <Button
                                variant={
                                  getVote(song) == -1
                                    ? "danger"
                                    : "outline-danger"
                                }
                                size="sm"
                                onClick={() => downvote(song)}
                              >
                                <CaretDownFill />
                              </Button>
                            </div>
                          ) : (
                            <Button variant="danger">Delete</Button>
                          )}
                        </td>
                        <td>{song.val.addedBy}</td>
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
            playerVars: {
              disablekb: 1,
              autoplay: 1,
              start: data.progress ? Math.floor(data.progress) : 0,
            },
          },
        }}
      />
    </div>
  );
}
export default VideoPlayer;
