import ReactPlayer from "react-player";

export class VideoPlayer extends React.Component {
  url = "";
  playing = true;
  muted = false;
  player = null;

  setVideo = (url) => {
    this.url = url;
    this.playing = true;
    this.muted = false;
  };

  stop = () => {
    this.player.getInternalPlayer().stopVideo();
  };

  ref = (player) => {
    this.player = player;
  };

  getPlayer() {
    return player;
  }

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
      <ReactPlayer
        url={this.url}
        controls={true}
        pip={false}
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
      />
    );
  }
}
export default VideoPlayer;
