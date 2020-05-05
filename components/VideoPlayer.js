import ReactPlayer from "react-player";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";

export function VideoPlayer(props) {
  let url = props.url;
  let muted = props.muted;
  const [player, setPlayer] = useState("");
  const [playing, setPlaying] = useState("");
  const [progress, setProgress] = useState("");
  const [started, setStarted] = useState("");

  setVideo = (url) => {
    this.url = url;
    this.playing = true;
    this.muted = false;
  };

<<<<<<< HEAD
  stop = () => {
    this.player.getInternalPlayer().stopVideo();
  };

  ref = (player) => {
    this.player = player;
  };
=======
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
>>>>>>> bn - added video progress bar

  getPlayer() {
    return player;
  }

<<<<<<< HEAD
  render() {
    //Video with playlist embedded
    // this.setVideo("https://www.youtube.com/watch?v=KpvvjoD9CSs&list=PLxOWk5x66lsHCeuqC86VRNko3U7kw8VMh&index=2&t=0s");
    //Playlist
    // this.setVideo("https://www.youtube.com/playlist?list=PLxOWk5x66lsHCeuqC86VRNko3U7kw8VMh");

    //Two Videos
    this.setVideo("https://www.youtube.com/watch?v=M7lc1UVf-VE");
    // this.setVideo("https://www.youtube.com/watch?v=zTitoHKsyJg");

    if (this.player != null) {
      this.player
        .getInternalPlayer()
        .loadPlaylist({ list: "PLxOWk5x66lsHCeuqC86VRNko3U7kw8VMh" });
      // this.player.getInternalPlayer().playVideo();
      // this.player.getInternalPlayer().loadVideoByUrl("https://www.youtube.com/v/zTitoHKsyJg?version=3");
    }
    return (
=======
  return (
    <div>
      {url != "" ? (
        <div>
          <Card style={{ width: "18rem" }}>
            <Card.Img variant="top" src={props.img} />
            {started ? (
              <Card.Body>
                <div>
                  <div>
                    <Button
                      className="mb-3"
                      variant="outline-primary"
                      onClick={handleToggle}
                    >
                      {playing ? "Pause" : "Play"}
                    </Button>
                  </div>
                  <div>
                    {playing ? "Playing" : "Paused"}: {props.videoTitle}
                  </div>
                  <div>
                    <ProgressBar now={progress} />
                  </div>
                </div>
              </Card.Body>
            ) : (
              <div></div>
            )}
          </Card>
        </div>
      ) : (
        <div></div>
      )}
>>>>>>> bn - added video progress bar
      <ReactPlayer
        url={this.url}
        controls={true}
        pip={false}
<<<<<<< HEAD
        playing={this.playing}
        muted={this.muted}
        ref={this.ref}
        // config={{
        //     youtube: {
        //       playerVars: { disablekb: 1, controls: 1, autoplay: 1, listType: 'playlist',
        //       list: "https://www.youtube.com/embed?listType=playlist&list=PLxOWk5x66lsHCeuqC86VRNko3U7kw8VMh"
        //         }
        //     }
        //   }}
=======
        playing={true}
        muted={muted}
        width={0}
        height={0}
        ref={initPlayer}
        onStart={handleStart}
        onProgress={handleProgress}
        onReady={handleReady}
        config={{
          youtube: {
            playerVars: { disablekb: 1, autoplay: 1 },
          },
        }}
>>>>>>> bn - added video progress bar
      />
    );
  }
}
export default VideoPlayer;
