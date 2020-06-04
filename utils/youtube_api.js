import config from "./config";
const API_KEY = "AIzaSyD8yr4vFW6dIjlAbU5QflsGefseN9IiMXM";
export async function fetchData(searchTerm) {
  const url =
    "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&order=relevance&q=" +
    searchTerm +
    "&type=video&videoCategoryId=10&key=" +
    API_KEY;
  const res = await fetch(url);
  return res.json();
}
