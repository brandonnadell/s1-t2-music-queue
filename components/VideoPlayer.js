import ReactPlayer from "react-player";
import {
  CaretUpFill,
  CaretDownFill,
  VolumeMuteFill,
  VolumeUpFill,
  PlayFill,
  PauseFill,
} from "react-bootstrap-icons";
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
import Holder from "./Holder";
// import BlackScreen from "../images/BlackScreen.jpg";

VideoPlayer.upvote = (song, database, roomId, user) => {
  if (
    song.val.votedUsers != null &&
    song.val.votedUsers[user.nickname] != null
  ) {
    let vote = song.val.votedUsers[user.nickname].vote;
    if (vote == 1) {
      database.removeUpvote(roomId, song, user);
      database.changePosition(song, roomId, -1);
    } else if (vote == -1) {
      database.downvoteToUpvote(roomId, song, user);
      database.changePosition(song, roomId, 2);
    }
  } else {
    database.addUpvote(roomId, song, user);
    database.changePosition(song, roomId, 1);
  }
};

VideoPlayer.downvote = (song, database, roomId, user) => {
  if (
    song.val.votedUsers != null &&
    song.val.votedUsers[user.nickname] != null
  ) {
    let vote = song.val.votedUsers[user.nickname].vote;
    if (vote == -1) {
      database.removeDownvote(roomId, song, user);
      database.changePosition(song, roomId, 1);
    } else if (vote == 1) {
      database.upvoteToDownvote(roomId, song, user);
      database.changePosition(song, roomId, -2);
    }
  } else {
    database.addDownvote(roomId, song, user);
    database.changePosition(song, roomId, -1);
  }
};

VideoPlayer.getVote = (song, user) => {
  return song.val.votedUsers != null &&
    song.val.votedUsers[user.nickname] != null
    ? song.val.votedUsers[user.nickname].vote
    : 0;
};

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
  const database = props.database;
  if (list && list.length !== 0) {
    data = list.val;
    key = list.key;
    url = data.videoUrl;
    title = data.title;
    img = data.image;
  }
  const [muted, setMuted] = useState(false);
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
    padding: "20px",
  };

  function handleToggle() {
    if (player.getSecondsLoaded() != null) {
      if (player.getInternalPlayer().getPlayerState() == 1) {
        player.getInternalPlayer().pauseVideo();
        setPlaying(false);
        if (creator === props.user.nickname) {
          database.updatePlaying(roomId, key, false);
        }
      } else {
        player.getInternalPlayer().playVideo();
        setPlaying(true);
        if (creator === props.user.nickname) {
          database.updatePlaying(roomId, key, true);
        }
      }
    }
  }

  function handleStart() {
    setPlaying(true);
    setStarted(true);
    if (props.user.nickname !== creator) {
      database.syncPlayer(roomId, key, player);
    } else {
      if (data.progress !== 0) player.seekTo(data.progress, false);
      database.updatePlaying(roomId, key, true);
    }
  }

  function handleReady() {
    setStarted(false);
  }

  function handleProgress() {
    let currentProg = (player.getCurrentTime() / player.getDuration()) * 100;
    if (props.user.nickname === creator) {
      if (Math.abs(currentProg - data.progress) > 1) {
        database.updateProgress(roomId, key, player);
      }
    }
    setProgress(setProgress(currentProg));
  }

  function handleSkipToEnd() {
    handleEnded();
  }

  function handleEnded() {
    if (creator == props.user.nickname) database.removePlaying(roomId, key);
    setStarted(false);
  }

  function initPlayer(player) {
    setPlayer(player);
  }

  img.length === 0
    ? (img =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSn7jUzIG-bPH-fiHZZppkCoN8yY5HWkNoO2VP-QmEjDb8xho_v&usqp=CAU")
    : img;
  return (
    <div>
      <div style={divStyle}>
        <div>
          <Card style={{ width: "19rem", height: "440px" }}>
            <Card.Img variant="top" src={img} style={{ height: "275px" }} />
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
              <div>
                {title.length > 0 ? (
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                ) : (
                  <Card.Body style={{ height: "164px", padding: "0px" }}>
                    <Alert variant="info" style={{ height: "100%" }}>
                      <Alert.Heading>
                        <h5>
                          Songs currently playing in the room will show up here.
                        </h5>
                      </Alert.Heading>
                      {/* <br> */}
                      <hr />
                      <div
                        style={{
                          fontSize: "12px",
                          fontStyle: "italic",
                          textAlign: "center",
                        }}
                      >
                        There are currently no songs being played at the moment.
                        Add songs to the player in the search on the right!
                      </div>
                    </Alert>
                  </Card.Body>
                )}
              </div>
            )}
          </Card>
        </div>
        <div>
          <Holder
            list={props.list}
            database={database}
            user={props.user}
            roomId={roomId}
            creator={creator}
            fetchData={props.fetchData}
          />
        </div>
      </div>
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
export function getVote(song, nickname) {
  return song.val.votedUsers != null && song.val.votedUsers[nickname] != null
    ? song.val.votedUsers[nickname].vote
    : 0;
}
export function upvoteTest(song, user) {
  if (
    song.val.votedUsers != null &&
    song.val.votedUsers[user.nickname] != null
  ) {
    let vote = song.val.votedUsers[user.nickname].vote;
    if (vote == 1) {
      // database.removeUpvote(roomId, song, user);
      song.val.votedUsers[user.nickname] = null;
      // database.changePosition(song, roomId, -1);
      song.val.position--;
      song.val.rating--;
    } else if (vote == -1) {
      // database.downvoteToUpvote(roomId, song, user);
      song.val.votedUsers[user.nickname] = 1;
      // database.changePosition(song, roomId, 2);
      song.val.position += 2;
      song.val.rating += 2;
    }
  } else {
    // database.addUpvote(roomId, song, user);
    song.val.votedUsers[user.nickname] = 1;
    // database.changePosition(song, roomId, 1);
    song.val.position++;
    song.val.rating++;
  }
  return song;
}
export default VideoPlayer;
