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
import ViewUserList from "./ViewUserList";
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
                  data-cy="search"
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
              data-cy="queue"
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
                data-cy="ban_users"
                // style={{ float: "right" }}
                variant="outline-danger"
                onClick={() => {
                  setToggleState("banordisplay");
                  cacheSongsBeforeToggle();
                }}
              >
                Ban Users
              </Button>
            ) : (
              <Button
                data-cy="userlist"
                variant="outline-success"
                onClick={() => {
                  setToggleState("banordisplay");
                  cacheSongsBeforeToggle();
                }}
              >
                View Users
              </Button>
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
                        <th style={{ width: "46%" }} data-cy="song">
                          Song
                        </th>
                        <th style={{ width: "10%" }}>
                          <center data-cy="rating">Rating</center>
                        </th>
                        <th style={{ width: "15%" }}>
                          <center data-cy="vote">Vote</center>
                        </th>
                        <th style={{ width: "20%" }} data-cy="added_by">
                          Added By
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
                        <Queue
                          list={props.list}
                          user={props.user}
                          userid={props.userid}
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
                          userid={props.userid}
                          database={props.database}
                          fetchData={props.fetchData}
                          songCache={songCache}
                        />
                      </tbody>
                    </Table>
                  </div>
                );
              case "banordisplay":
                return (
                  <div>
                    {props.creator === props.user.nickname ? (
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
                            <th style={{ width: "40%" }} data-cy="name">
                              Name
                            </th>
                            <th style={{ width: "30%" }} data-cy="display_name">
                              Display Name
                            </th>
                            <th
                              style={{ width: "20%" }}
                              data-cy="ban_from_room"
                            >
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
                    ) : (
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
                            <th style={{ width: "40%" }} data-cy="name">
                              Name
                            </th>
                            <th style={{ width: "30%" }} data-cy="display_name">
                              Display Name
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
                            <ViewUserList
                              userList={userList}
                              roomId={props.roomId}
                              database={props.database}
                            />
                          </tbody>
                        </Table>
                      </div>
                    )}
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
