import firebase from "../../client/firebase";

describe("Video Player", () => {
  beforeEach(() => {
    // runs before each test in the block
    cy.loginAsAdmin();
    firebase
      .database()
      .ref("rooms")
      .push()
      .set({
        room_key: {
          songs: {
            song_key: {
              title: "Song",
              rating: 0,
              position: -1,
            },
          },
        },
      });
    cy.visit("http://localhost:3000/room/room_key");
  });

  it("went to room homepage", () => {
    cy.url().should("eq", "http://localhost:3000/room/room_key");
  });

  it("has room label", () => {
    cy.get("p").should("have.text", "Room: room_key");
  });

  it("has vote button", () => {
    cy.get("center button:first").should("have.class", "active");
  });
});
