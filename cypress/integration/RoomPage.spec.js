import firebase from "../../client/firebase";

describe("Roompage", () => {
  beforeEach(() => {
    // runs before each test in the block
    cy.loginAsAdmin();
    cy.visit("http://localhost:3000/room/room_key");
  });

  it("Correctly shows the RoomID", () => {
    cy.contains("Room:");
  });

  it("has a status bar indicate where will the song be playing", () => {
    cy.contains("Songs currently playing in the room will show up here.");
  });

  it("has a Queue song botton", () => {
    cy.contains("Queue");
  });

  it("has a Search song botton", () => {
    cy.contains("Search");
  });
});
