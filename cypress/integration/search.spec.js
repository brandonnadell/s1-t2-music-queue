import API_KEY from "../../utils/youtube_api";
describe("YouTube Search API", () => {
  it("returns an object with with search results given a valid API key", () => {
    cy.request({
      url:
        "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&order=relevance&q=travis&type=video&videoCategoryId=10&key=" +
        "AIzaSyD4w-HBATX5lOQXlsavwuMZxi1MJj-Xkg8",
    }).then((response) => {
      expect(response.body).to.have.property(
        "kind",
        "youtube#searchListResponse"
      );
    });
  });
  it("has error code response 400 when API key is invalid", () => {
    cy.request({
      url:
        "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&order=relevance&q=duck&type=video&videoCategoryId=10&key=" +
        1234,
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.body.error).to.have.property("code", 400);
    });
  });
});
