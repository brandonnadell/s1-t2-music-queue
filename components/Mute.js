import Button from "react-bootstrap/Button";
import { VolumeMuteFill, VolumeUpFill } from "react-bootstrap-icons";

export function Mute(props) {
  let muted = props.muted;
  let toggleMute = props.toggleMute;
  return (
    <Button
      variant={muted ? "primary" : "outline-light"}
      onClick={() => toggleMute(!muted)}
    >
      {muted ? <VolumeMuteFill /> : <VolumeUpFill />}
    </Button>
  );
}
export default Mute;
