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

const Ban = (props) => {
  return (
    <div style={{ height: "100%" }}>
      {props.userList.length > 1 ? (
        <div>
          {props.userList.slice(1, props.userList.length).map((user, ind) => (
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
                    onClick={() => {
                      props.database
                        .database()
                        .ref("rooms/" + props.roomId + "/bannedUsers")
                        .push(user);
                      props.database
                        .database()
                        .ref("rooms/" + props.roomId + "/users")
                        .child(user.key)
                        .remove();
                      console.log(user.key);
                    }}
                  >
                    Kick
                  </Button>
                </center>
              </td>
            </tr>
          ))}
        </div>
      ) : (
        <center style={{ height: "100%", color: "#da4854" }}>
          <Alert style={{ height: "100%", padding: "12%" }}>
            <Alert.Heading>
              A list of all other users in the room will show up here.
            </Alert.Heading>
            <div style={{ fontStyle: "italic" }}>
              There are currently no other users in the room :(
            </div>
          </Alert>
        </center>
      )}
    </div>
  );
};
export default Ban;
