import { getVote } from "../components/VideoPlayer";

describe("components/VideoPlayer", () => {
  describe("getVote", () => {
    it("get 1 because cguacho has voted 1", () => {
      expect(
        getVote(
          {
            val: {
              votedUsers: {
                cgaucho: {
                  vote: 1,
                },
              },
            },
          },
          "cgaucho"
        )
      ).toBe(1);
    });
    it("get -1 because cguacho has voted -1", () => {
      expect(
        getVote(
          {
            val: {
              votedUsers: {
                cgaucho: {
                  vote: -1,
                },
                johndoe: {
                  vote: 1,
                },
              },
            },
          },
          "cgaucho"
        )
      ).toBe(-1);
    });
    it("get 0 because cguacho has not voted", () => {
      expect(
        getVote(
          {
            val: {
              votedUsers: {
                johndoe: {
                  vote: 1,
                },
              },
            },
          },
          "cgaucho"
        )
      ).toBe(0);
    });
    it("get 0 because votedUsers doesn't exist", () => {
      expect(
        getVote(
          {
            val: {},
          },
          "cgaucho"
        )
      ).toBe(0);
    });
  });
});
