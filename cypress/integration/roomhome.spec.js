import firebase from "../../client/firebase";
import { testingConfig } from "../../client/firebase";

describe("Room Page", () => {
  beforeEach(() => {
    // runs before each test in the block
    cy.loginAsAdmin();
    let song_key = firebase.database().ref("rooms/room_key/songs").push().key;
    firebase.database().ref("rooms/room_key/songs").child(song_key).set({
      title: "Song",
      rating: 0,
      position: -1,
    });
    let user_key = firebase.database().ref("rooms/room_key/users").push().key;
    firebase.database().ref("rooms/room_key/users").child(user_key).set({
      nickname: "cgaucho",
    });
    /*
      Writing to database doesn't work...
      Maybe because there isn't a current listener or user or something
    */
    cy.visit("http://localhost:3000/room/room_key");
  });

  it("went to room homepage", () => {
    cy.url().should("eq", "http://localhost:3000/room/room_key");
  });

  it("has room key label", () => {
    cy.get("p").should("have.text", "Room: room_key");
  });

  //fails
  it("has vote button", () => {
    cy.get("center button:first").should("have.class", "active");
  });
});
