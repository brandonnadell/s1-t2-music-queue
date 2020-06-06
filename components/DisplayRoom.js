import React, { useState, useEffect } from "react";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

const DisplayRoom = (props) => {
  const [tempNickname, setTempNickname] = useState("");
  let creator = props.admin;

  function updateNickname() {
    props.database.changeNickname(tempNickname, props.roomId);
  }

  return (
    <div>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Enter Nickname..."
          onChange={(e) => setTempNickname(e.target.value)}
        />
        <InputGroup.Append>
          {creator === props.user.nickname ? (
            <Button variant="outline-dark" onClick={() => updateNickname()}>
              Rename Room
            </Button>
          ) : (
            <div></div>
          )}
        </InputGroup.Append>
      </InputGroup>
    </div>
  );
};
export default DisplayRoom;
