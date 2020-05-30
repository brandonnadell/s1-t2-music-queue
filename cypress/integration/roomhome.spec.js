import firebase from "../../client/firebase";

describe("Home Page", () => {
  beforeEach(() => {
    // runs before each test in the block
    cy.loginAsAdmin();
    cy.visit("http://localhost:3000");
  });

  /*
    TODO:
    cy.loginAsAdmin() routes to login page, instead of actually logging the user in
  */

  it("went to localhost", () => {
    cy.url().should("eq", "http://localhost:3000/");
  });

  it("has create room component", () => {
    cy.get("createroom").should("exist");
  });

  it("has create room component", () => {
    cy.get("createRoom").should("exist");
  });

  it("has create room component3", () => {
    cy.get("CreateRoom").should("exist");
  });

  it("has layout", () => {
    cy.get("[data-cy=layout]").should("exist");
  });
});
