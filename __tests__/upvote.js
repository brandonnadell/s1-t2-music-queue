import { getVote, upvoteTest } from "../components/VideoPlayer";
import firebase from "../client/firebase";

describe("components/VideoPlayer", () => {
  describe("upvote", () => {
    const song = {
      key: "song_key",
      val: {
        rating: 0,
        position: -1,
        votedUsers: {},
      },
    };
    const updatedSong = upvoteTest(song, { nickname: "cgaucho" });
    it("change vote from 0 to 1", () => {
      expect(updatedSong.val.votedUsers["cgaucho"]).toBe(1);
    });
    it("change rating from 0 to 1", () => {
      expect(updatedSong.val.rating).toBe(1);
    });
    it("change position from -1 to 0", () => {
      expect(updatedSong.val.position).toBe(0);
    });

    const song2 = {
      key: "song_key",
      val: {
        rating: 1,
        position: 0,
        votedUsers: {
          cgaucho: {
            vote: 1,
          },
        },
      },
    };
    const updatedSong2 = upvoteTest(song2, { nickname: "cgaucho" });
    it("change vote from 1 to 0", () => {
      expect(updatedSong2.val.votedUsers["cgaucho"]).toBe(null);
    });
    it("change rating from 1 to 0", () => {
      expect(updatedSong2.val.rating).toBe(0);
    });
    it("change position from 0 to -1", () => {
      expect(updatedSong2.val.position).toBe(-1);
    });

    const song3 = {
      key: "song_key",
      val: {
        rating: -1,
        position: -2,
        votedUsers: {
          cgaucho: {
            vote: -1,
          },
        },
      },
    };
    const updatedSong3 = upvoteTest(song3, { nickname: "cgaucho" });
    it("change vote from -1 to 1", () => {
      expect(updatedSong3.val.votedUsers["cgaucho"]).toBe(1);
    });
    it("change rating from -1 to 1", () => {
      expect(updatedSong3.val.rating).toBe(1);
    });
    it("change position from -2 to -1", () => {
      expect(updatedSong3.val.position).toBe(0);
    });

    //--------- Firebase testing that doen't work ----------

    // firebase
    //   .database()
    //   .ref("rooms")
    //   .push()
    //   .set({
    //     room_key: {
    //       songs: {},
    //     },
    //   });
    // firebase.database().ref("rooms/room_key/songs").push().set(song);

    // it("change vote 0 to 1", () => {
    //     firebase.database().ref("rooms/room_key/songs").child(song.key).once("value").then((snapshot) => {
    //         expect(getVote(snapshot, "cgaucho")).toBe(1);
    //     })
    // });

    // it("change rating 0 to 1", () => {
    //     firebase.database().ref("rooms/room_key/songs").child(song.key).once("value").then((snapshot) => {
    //         expect(snapshot.val().rating).toBe(1);
    //     })
    // });

    // it("change postion -1 to 0", () => {
    //     firebase.database().ref("rooms/room_key/songs").child(song.key).once("value").then((snapshot) => {
    //         expect(snapshot.val().position).toBe(0);
    //     })
    // });
  });
});
