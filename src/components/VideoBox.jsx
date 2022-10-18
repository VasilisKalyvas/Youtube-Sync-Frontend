import { React } from "react";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ReactPlayer from "react-player";
import { FaPlay, FaPause } from "react-icons/fa";
import Button from "react-bootstrap/Button";
import io from "socket.io-client";
const socket = io.connect("https://youtubesync-v1.herokuapp.com/");

const VideoBox = ({
  video,
  setVideo,
  setOnPlay,
  playerRef,
  progressBar,
  setMoveToSeconds,
  setCurrentTime,
  moveToSeconds,
  currentTime,
  duration,
  format,
  playedTime,
  onPlay,
  setPlayedTime,
  submit,
  setSubmit,
  currentRoom,
}) => {
  const submitHandler = () => {
    setSubmit(true);
    socket.emit("onVideoLink", {
      video: video.split("=")[1],
      submit: submit,
      currentRoom: currentRoom,
    });
    setVideo("");
  };
  const onChange = (e) => {
    e.preventDefault();

    setVideo(e.target.value);
    
  };

  const handlePlay = () => {
    setOnPlay(true);
    socket.emit("onVideoStatus", {
      status: true,
      currentRoom: currentRoom,
    });
  };

  const handlePause = () => {
    setOnPlay(false);
    socket.emit("onVideoStatus", {
      status: false,
      currentRoom: currentRoom,
    });
  };

  const submitTimeHandler = () => {
    playerRef.current.currentTime = progressBar.current.value;
    setMoveToSeconds(progressBar.current.value);
    setCurrentTime(moveToSeconds);
    setOnPlay(false);
    setPlayedTime(() => format(currentTime));
    socket.emit("onSecondsChange", {
      time: currentTime,
      currentRoom: currentRoom,
    });
    playerRef.current.seekTo(currentTime, "seconds");
  };
  return (
    <div className="videobox">
      <form onSubmit={submitHandler}>
      <InputGroup className="col-6">
        <FormControl
          onChange={(e) => onChange(e)}
          placeholder="Video Link"
        ></FormControl>
        <Button type="button" variant="success">
            Watch
        </Button> 
      </InputGroup>
      </form>
     
      <Card>
        <Card.Body>
          <Row>
            <Col>
              <strong>Video</strong>
            </Col>
          </Row>
          <hr />
          <ReactPlayer
            width="500px"
            height="300px"
            className="video"
            ref={playerRef}
            onPause={handlePause}
            onPlay={handlePlay}
            playing={onPlay}
            onProgress={(event) => {
              setCurrentTime(event.playedSeconds);
            }}
            step="0.1"
            url={`https://www.youtube.com/embed/${video}`}
          ></ReactPlayer>
          <Row style={{ marginTop: "20px", gap: "10px" }} className="video">
            <Col
              className=""
              style={{ display: "flex", gap: "10px", alignItems: "center" }}
            >
              {!onPlay ? (
                <FaPlay style={{ cursor: "pointer" }} onClick={handlePlay} />
              ) : (
                <FaPause style={{ cursor: "pointer" }} onClick={handlePause} />
              )}
              <div className="video-time">
                <p>{playedTime}</p>
                <p>~</p>
                <p>
                  {duration === null ? <>00:00:00</> : <>{format(duration)}</>}
                </p>

                <input
                  type="range"
                  ref={progressBar}
                  value={`${currentTime}`}
                  min={0}
                  max={duration}
                  onChange={submitTimeHandler}
                />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default VideoBox;
