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

const Queue = (props) => {
  return (
    <div style={{ height: "100%" }}>
      {props.list.length > 1 ? (
        <div>
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
                          VideoPlayer.getVote(song, props.user) == 1
                            ? "primary"
                            : "outline-primary"
                        }
                        size="sm"
                        onClick={() =>
                          VideoPlayer.upvote(
                            song,
                            props.database,
                            props.roomId,
                            props.user
                          )
                        }
                      >
                        <CaretUpFill />
                      </Button>
                      <Button
                        variant={
                          VideoPlayer.getVote(song, props.user) == -1
                            ? "danger"
                            : "outline-danger"
                        }
                        size="sm"
                        onClick={() =>
                          VideoPlayer.downvote(
                            song,
                            props.database,
                            props.roomId,
                            props.user
                          )
                        }
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
                        props.database.removeSong(
                          props.roomId,
                          song,
                          props.userid
                        )
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
        </div>
      ) : (
        <center style={{ height: "100%" }}>
          <Alert style={{ height: "100%", padding: "12%" }} variant="warning">
            <Alert.Heading>
              Songs added to the queue will show up here.
            </Alert.Heading>
            <div style={{ fontStyle: "italic" }}>
              There are currently no songs queued in the room. Add to the queue
              by searching for your favorite songs!
            </div>
          </Alert>
        </center>
      )}
    </div>
  );
};
export default Queue;
