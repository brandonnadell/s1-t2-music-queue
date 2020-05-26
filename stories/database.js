class database {
  createSong = (url, title, img, roomId, name) => {
    return true;
  };

  updatePlaying = (roomId, key, status) => {
    return status;
  };

  syncPlayer = (roomId, key, player) => {
    player.seekTo(0);
  };

  updateProgress = (roomId, key, player) => {
    return player.getCurrentTime();
  };

  removePlaying = (roomId, key) => {
    return key;
  };

  removeUpvote = (roomId, song, user) => {
    return 0;
  };

  downvoteToUpvote = (roomId, song, user) => {
    return 1;
  };

  addUpvote = (roomId, song, user) => {
    return 1;
  };

  removeDownvote = (roomId, song, user) => {
    return 0;
  };

  upvoteToDownvote = (roomId, song, user) => {
    return -1;
  };

  addDownvote = (roomId, song, user) => {
    return -1;
  };

  changePosition = (song, roomId, change) => {
    return 0;
  };

  removeSong = (roomId, song) => {
    return song;
  };

  createRoom = (user) => {
    return "ABCD";
  };

  getRooms = () => {
    return new Promise(() => {
      return null;
    });
  };
}

database = new database();
export default database;
