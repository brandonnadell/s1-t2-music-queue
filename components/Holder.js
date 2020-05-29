import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InputGroup, { InputGroupAppend } from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import FormControl from "react-bootstrap/FormControl";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";
import { CaretUpFill, CaretDownFill } from "react-bootstrap-icons";
import VideoPlayer from "./VideoPlayer";
import SearchBar from "./SearchBar";
import Queue from "./Queue";
import Ban from "./Ban";

let users = [];
let names = [];
let songCache = [];
const Holder = (props) => {
  const router = useRouter();
  const [toggleState, setToggleState] = useState("queue");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCount, setSearchCount] = useState(0);
  const [detectOnChange, setDetectOnChange] = useState(false);
  const [data, setData] = useState("");
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    let usersRef = props.database
      .database()
      .ref("rooms/" + props.roomId + "/users");
    usersRef.on("value", (snapshot) => {
      users = [];
      names = [];
      snapshot.forEach((child) => {
        users.push({ key: child.key, val: child.val() });
        names.push(child.val().nickname);
      });
      setUserList(users);
    });
    usersRef.on("child_removed", (snapshot) => {
      if (snapshot.val().nickname === props.user.nickname) {
        window.alert(
          "You are banned from joining this room! Try a different room or create your own room."
        );
        router.push("/");
      } else console.warn("---holder baned : ", props.user.nickname);
    });
    return () => {
      usersRef.off();
    };
  }, []);

  function cacheSongsBeforeToggle() {
    if (SearchBar && SearchBar.getSongs) songCache = SearchBar.getSongs();
  }

  function handleKeyPress(key) {
    if (key === "Enter" && detectOnChange) {
      // songCache = [];
      setSearchCount(searchCount + 1);
      SearchBar.setSearchCount(searchCount + 1);
    }
    setDetectOnChange(false);
  }

  return (
    <div>
      <Card style={{ width: "48rem", height: "440px" }}>
        <Card.Header
          bg="dark"
          style={{
            display: "flex",
            flexFlow: "row nowrap",
            backgroundColor: "black",
          }}
        >
          {/* Queue */}
          <div style={{ flex: "1" }}>
            <InputGroup>
              <FormControl
                float="left"
                placeholder="Search for music..."
                aria-label="Search for music..."
                aria-describedby="basic-addon2"
                onFocus={(e) => {
                  setToggleState("search");
                }}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setData([]);
                    SearchBar.setData([]);
                    songCache = [];
                  }
                  setSearchTerm(e.target.value);
                  SearchBar.setSearchTerm(e.target.value);
                  setDetectOnChange(true);
                }}
                onKeyPress={(e) => {
                  handleKeyPress(e.key);
                }}
              />
              <InputGroup.Append>
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    // setSearchCount(searchCount + 1)
                    // songCache = []
                    // if (searchTerm.length === 0) songCache = [];
                    setSearchCount(searchCount + 1);
                    if (SearchBar && SearchBar.setSearchCount && detectOnChange)
                      SearchBar.setSearchCount(searchCount + 1);
                    setToggleState("search");
                    setDetectOnChange(false);
                  }}
                >
                  Search
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </div>
          <div style={{ display: "flex", marginLeft: "2%" }}>
            <Button
              // style={{ float: "right" }}
              variant="outline-warning"
              onClick={() => {
                setToggleState("queue");
                cacheSongsBeforeToggle();
              }}
            >
              Queue
            </Button>
            {props.creator === props.user.nickname ? (
              <Button
                // style={{ float: "right" }}
                variant="outline-danger"
                onClick={() => {
                  setToggleState("ban");
                  cacheSongsBeforeToggle();
                }}
              >
                Ban Users
              </Button>
            ) : (
              <div></div>
            )}
          </div>
        </Card.Header>
        <Table variant="dark" style={{ marginBottom: "0px", height: "374px" }}>
          {(() => {
            switch (toggleState) {
              case "queue":
                return (
                  <div style={{ height: "374px" }}>
                    <thead
                      style={{
                        display: "table",
                        width: "100%",
                        tableLayout: "fixed",
                      }}
                    >
                      <tr>
                        <th style={{ width: "9%" }}></th>
                        <th style={{ width: "46%" }}>Song</th>
                        <th style={{ width: "10%" }}>
                          <center>Rating</center>
                        </th>
                        <th style={{ width: "15%" }}>
                          <center>Vote</center>
                        </th>
                        <th style={{ width: "20%" }}>Added By</th>
                      </tr>
                    </thead>
                    <Table
                      hover
                      variant="light"
                      style={{ marginBottom: "0px", height: "323px" }}
                    >
                      <tbody
                        style={{
                          height: "323px",
                          overflow: "scroll",
                          display: "block",
                        }}
                      >
                        <Queue
                          list={props.list}
                          user={props.user}
                          roomId={props.roomId}
                          database={props.database}
                        />
                      </tbody>
                    </Table>
                  </div>
                );

              case "search":
                return (
                  <div>
                    <thead
                      style={{
                        display: "table",
                        width: "100%",
                        tableLayout: "fixed",
                      }}
                    >
                      <tr>
                        <th style={{ width: "15%" }}></th>
                        <th style={{ width: "65%" }}>Title</th>
                        <th style={{ width: "20%" }}>Artist</th>
                      </tr>
                    </thead>
                    <Table
                      hover
                      variant="light"
                      style={{ marginBottom: "0px", height: "323px" }}
                    >
                      <tbody
                        style={{
                          height: "323px",
                          overflow: "scroll",
                          display: "block",
                        }}
                      >
                        <SearchBar
                          roomId={props.roomId}
                          user={props.user}
                          database={props.database}
                          fetchData={props.fetchData}
                          songCache={songCache}
                        />
                      </tbody>
                    </Table>
                  </div>
                );
              case "ban":
                return (
                  <div>
                    <thead
                      style={{
                        display: "table",
                        width: "100%",
                        tableLayout: "fixed",
                      }}
                    >
                      <tr>
                        <th style={{ width: "10%" }}></th>
                        <th style={{ width: "40%" }}>Name</th>
                        <th style={{ width: "30%" }}>Display Name</th>
                        <th style={{ width: "20%" }}>
                          <center>Ban from Room</center>
                        </th>
                      </tr>
                    </thead>
                    <Table
                      hover
                      variant="light"
                      style={{ marginBottom: "0px", height: "323px" }}
                    >
                      <tbody
                        style={{
                          height: "323px",
                          overflow: "scroll",
                          display: "block",
                        }}
                      >
                        <Ban
                          userList={userList}
                          roomId={props.roomId}
                          database={props.database}
                        />
                      </tbody>
                    </Table>
                  </div>
                );
              default:
                return null;
            }
          })()}
        </Table>
      </Card>
    </div>
  );
};
export default Holder;

{
  /* {toggleState === "queue" ? (
                        <div>
                            <thead
                                style={{
                                    display: "table",
                                    width: "100%",
                                    tableLayout: "fixed",
                                }}
                            >
                                <tr>
                                    <th style={{ width: "9%" }}></th>
                                    <th style={{ width: "46%" }}>Song</th>
                                    <th style={{ width: "10%" }}>
                                        <center>Rating</center>
                                    </th>
                                    <th style={{ width: "15%" }}>
                                        <center>Vote</center>
                                    </th>
                                    <th style={{ width: "20%" }}>Added By</th>
                                </tr>
                            </thead>
                            <tbody
                                style={{
                                    height: "277px",
                                    overflow: "scroll",
                                    display: "block",
                                }}
                            >
                                {props.list.slice(1, props.list.length).map((song, ind) => (
                                    <tr
                                        key={song.title}
                                        style={{
                                            display: "table",
                                            width: "100%",
                                            tableLayout: "fixed",
                                        }}
                                    >
                                        <td style={{ width: "9%" }}>{ind + 1}</td>
                                        <td style={{ width: "46%" }}>{song.val.title}</td>
                                        <td style={{ width: "10%" }}>
                                            <center>{song.val.rating}</center>
                                        </td>
                                        <td style={{ width: "15%" }}>
                                            {song.val.addedBy !== props.user.nickname ? (
                                                <div>
                                                    <center>
                                                        <Button
                                                            variant={
                                                                VideoPlayer.getVote(song) == 1
                                                                    ? "primary"
                                                                    : "outline-primary"
                                                            }
                                                            size="sm"
                                                            onClick={() => VideoPlayer.upvote(song, props.database)}
                                                        >
                                                            <CaretUpFill />
                                                        </Button>
                                                        <Button
                                                            variant={
                                                                VideoPlayer.getVote(song) == -1
                                                                    ? "danger"
                                                                    : "outline-danger"
                                                            }
                                                            size="sm"
                                                            onClick={() => VideoPlayer.downvote(song, props.database)}
                                                        >
                                                            <CaretDownFill />
                                                        </Button>
                                                    </center>
                                                </div>
                                            ) : (
                                                    <center>
                                                        <Button
                                                            variant="danger"
                                                            onClick={() =>
                                                                database.removeSong(roomId, song)
                                                            }
                                                        >
                                                            Delete
                                                    </Button>
                                                    </center>
                                                )}
                                        </td>
                                        <td style={{ width: "20%" }}>{song.val.addedBy}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </div>
                    ) : (<div>
                        <thead
                            style={{
                                display: "table",
                                width: "100%",
                                tableLayout: "fixed",
                            }}
                        >
                            <tr>
                                <th style={{ width: "10%" }}></th>
                                <th style={{ width: "40%" }}>Name</th>
                                <th style={{ width: "30%" }}>Display Name</th>
                                <th style={{ width: "20%" }}>
                                    <center>Ban from Room</center>
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            style={{
                                height: "277px",
                                overflow: "scroll",
                                display: "block",
                            }}
                        >
                            {users.slice(1, users.length).map((user, ind) => (
                                <tr
                                    key={user.name}
                                    style={{
                                        display: "table",
                                        width: "100%",
                                        tableLayout: "fixed",
                                    }}
                                >
                                    <td style={{ width: "10%" }}>
                                        <Image
                                            className="img-responsive"
                                            src={user.val.picture}
                                            height="40"
                                            width="40"
                                            rounded
                                        />{" "}
                                    </td>
                                    <td style={{ width: "40%" }}>{user.val.name}</td>
                                    <td style={{ width: "30%" }}>{user.val.nickname}</td>
                                    <td style={{ width: "20%" }}>
                                        <center>
                                            <Button
                                                variant="danger"
                                                onClick={() => database.removeSong(roomId, song)}
                                            >
                                                Kick
                                            </Button>
                                        </center>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </div>)} */
}

//                 <div>
//                     {props.list.slice(1, props.list.length).map((song, ind) => (
//                         <tr
//                             key={song.title}
//                             style={{
//                                 display: "table",
//                                 width: "100%",
//                                 tableLayout: "fixed",
//                             }}
//                         >
//                             <td style={{ width: "9%" }}>{ind + 1}</td>
//                             <td style={{ width: "46%" }}>{song.val.title}</td>
//                             <td style={{ width: "10%" }}>
//                                 <center>{song.val.rating}</center>
//                             </td>
//                             <td style={{ width: "15%" }}>
//                                 {song.val.addedBy !== props.user.nickname ? (
//                                     <div>
//                                         <center>
//                                             <Button
//                                                 variant={
//                                                     VideoPlayer.getVote(song) == 1
//                                                         ? "primary"
//                                                         : "outline-primary"
//                                                 }
//                                                 size="sm"
//                                                 onClick={() => VideoPlayer.upvote(song, props.database)}
//                                             >
//                                                 <CaretUpFill />
//                                             </Button>
//                                             <Button
//                                                 variant={
//                                                     VideoPlayer.getVote(song) == -1
//                                                         ? "danger"
//                                                         : "outline-danger"
//                                                 }
//                                                 size="sm"
//                                                 onClick={() => VideoPlayer.downvote(song, props.database)}
//                                             >
//                                                 <CaretDownFill />
//                                             </Button>
//                                         </center>
//                                     </div>
//                                 ) : (
//                                         <center>
//                                             <Button
//                                                 variant="danger"
//                                                 onClick={() =>
//                                                     props.database.removeSong(props.roomId, song)
//                                                 }
//                                             >
//                                                 Delete
//                                 </Button>
//                                         </center>
//                                     )}
//                             </td>
//                             <td style={{ width: "20%" }}>{song.val.addedBy}</td>
//                         </tr>
//                     ))}
//                 </div>) : (<center style={{ height: "100%" }}>
//                     <Alert style={{ height: "100%", padding: "12%" }} variant="warning">
//                         <Alert.Heading>Songs added to the queue will show up here.</Alert.Heading>
//                         <div style={{ fontStyle: "italic" }}>There are currently no songs queued in the room.
//                         Add to the queue by searching for your favorite songs!</div>
//                     </Alert>
//                 </center>)}
//         </tbody>
//     </Table>
// </div>;
