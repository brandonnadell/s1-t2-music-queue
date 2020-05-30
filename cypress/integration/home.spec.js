import firebase from "../../client/firebase";

describe("Home Page", () => {
  beforeEach(() => {
    // runs before each test in the block
    cy.visit("http://localhost:3000");
  });

  it("has not logged in warning", () => {
    cy.get("div").should("have.text", "You're not logged in!");
  });
});
