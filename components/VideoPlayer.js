import ReactPlayer from "react-player";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import React, { useState, useEffect } from "react";

export function VideoPlayer(props) {
  let queue = props.queue;
  let url = queue[0];
  let title = props.titles[0];
  let img = props.imgs[0];
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
    setProgress(0);
  }

  function handleProgress() {
    setProgress((player.getCurrentTime() / player.getDuration()) * 100);
  }

  function handleSkipToEnd() {
    player.seekTo(player.getDuration() - 3, "seconds");
  }

  function handleEnded() {
    queue.shift();
    props.titles.shift();
    props.imgs.shift();
    setStarted(false);
  }

  function initPlayer(player) {
    setPlayer(player);
  }

  return (
    <div>
      {url && url != "" ? (
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
            {queue.length > 1 ? (
              <Card>
                <Card.Header as="h5">Queue</Card.Header>
                <Table striped>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Song</th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.titles
                      .slice(1, props.titles.length)
                      .map((title, ind) => (
                        <tr>
                          <td>{ind + 1}</td>
                          <td>{title}</td>
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
            playerVars: { disablekb: 1, autoplay: 1 },
          },
        }}
      />
    </div>
  );
}
export default VideoPlayer;
