import React, { useEffect, useRef } from "react";
import { useState } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import io from "socket.io-client";
import OnlineBox from "../components/OnlineBox";
import ChatBox from "../components/ChatBox";
import VideoBox from "../components/VideoBox";

const socket = io.connect("http://localhost:5000");

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [username, setUsername] = useState("");

  const [currentRoom, setCurrentRoom] = useState("");
  const [currentName, setCurrentName] = useState("");
  const [video, setVideo] = useState("");
  const [online, setOnline] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playedTime, setPlayedTime] = useState("");
  const [moveToSeconds, setMoveToSeconds] = useState(0);
  const [onPlay, setOnPlay] = useState(false);
  const [duration, setDuration] = useState(0);
  const [submit, setSubmit] = useState(false);
  const playerRef = useRef();
  const progressBar = useRef();

  useEffect(() => {
    socket.on("video", (data) => {
      if (data.currentRoom === currentRoom) {
        setVideo(data.videoLink);
        setSubmit(data.submit);
      }
    });
    socket.on("rooms", (data) => {
      setRooms(data);
    });
    socket.on("online", (data) => {
      setOnline(data);
    });

    socket.on("messages", (data) => {
      setMessages([...messages, data]);
    });

    socket.on("videoStatus", (data) => {
      if (data.currentRoom === currentRoom) {
        setOnPlay(data.status);
      }
    });
    socket.on("secondsChange", (data) => {
      if (data.currentRoom === currentRoom) {
        setCurrentTime(data.time);
        setMoveToSeconds(data.time);
        setPlayedTime(() => format(data.time));
        playerRef.current.seekTo(data.time, "seconds");
      }
    });
    const showTime = () => {
      let hours = Math.floor(parseInt(currentTime) / 3600);
      let mins = Math.floor(parseInt(currentTime) / 60) - hours * 60;
      let secs = Math.floor(parseInt(currentTime) % 60);
      let output =
        hours.toString().padStart(2, "0") +
        ":" +
        mins.toString().padStart(2, "0") +
        ":" +
        secs.toString().padStart(2, "0");
      setPlayedTime(output);
    };
    showTime();
    setDuration(() =>
      playerRef && playerRef.current ? playerRef.current.getDuration() : "00:00"
    );
  }, [currentTime, moveToSeconds, messages, currentRoom]);

  const format = (time) => {
    let hours = Math.floor(parseInt(time) / 3600);
    let mins = Math.floor(parseInt(time) / 60) - hours * 60;
    let secs = Math.floor(parseInt(time) % 60);
    let output =
      hours.toString().padStart(2, "0") +
      ":" +
      mins.toString().padStart(2, "0") +
      ":" +
      secs.toString().padStart(2, "0");
    return output;
  };
  const submitHandler1 = () => {
    if (roomName !== "" && username !== "") {
      socket.emit("join_room", { roomName, username });
    }
    setCurrentName(username);
    setUsername("");
    setCurrentRoom(roomName);
    setRoomName("");
    setLoggedIn(true);
  };

  const submitHandler2 = ({ room }) => {
    setRoomName(room);
    if (roomName !== "" && username !== "") {
      socket.emit("join_room", { roomName, username });
      setCurrentName(username);
      setUsername("");
      setCurrentRoom(room);
      setRoomName("");
      setLoggedIn(true);
    }
  };
  return (
    <>
      {!loggedIn ? (
        <>
          <div
            style={{
              justifyContent: "center",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "left",
                marginTop: "20px",
              }}
            >
              <InputGroup className="col-6">
                <FormControl
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="User Name"
                ></FormControl>
                <FormControl
                  value={roomName || ""}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Room Name"
                ></FormControl>
                <Button variant="success" onClick={submitHandler1}>
                  Enter
                </Button>
              </InputGroup>
            </div>
            {rooms?.length !== 0 ? (
              <>
                <p>Or join an existed room</p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "left",
                    marginTop: "20px",
                  }}
                >
                  <ListGroup>
                    {rooms?.map((room, index) => (
                      <ListGroup.Item
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        {room}
                        <p
                          style={{ cursor: "pointer" }}
                          onClick={() => submitHandler2({ room })}
                        >
                          Join
                        </p>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "left",
                    marginTop: "20px",
                  }}
                >
                  <ListGroup>
                    <ListGroup.Item>0 rooms</ListGroup.Item>
                  </ListGroup>
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <VideoBox
              currentRoom={currentRoom}
              video={video}
              setVideo={setVideo}
              setOnPlay={setOnPlay}
              playerRef={playerRef}
              progressBar={progressBar}
              setMoveToSeconds={setMoveToSeconds}
              setCurrentTime={setCurrentTime}
              moveToSeconds={moveToSeconds}
              currentTime={currentTime}
              duration={duration}
              format={format}
              playedTime={playedTime}
              onPlay={onPlay}
              setPlayedTime={setPlayedTime}
              submit={submit}
              setSubmit={setSubmit}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-arround",
                gap: "20px",
              }}
            >
              <ChatBox
                currentName={currentName}
                messages={messages}
                setMessages={setMessages}
                currentRoom={currentRoom}
              />
              <OnlineBox online={online} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HomePage;
