import React, { useRef } from "react";
import { useEffect } from "react";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { useState } from "react";
import io from "socket.io-client";
const socket = io.connect("http://localhost:5000");

const ChatBox = ({ messages, currentRoom, setMessages, currentName }) => {
  const MessagesScrollRef = useRef(null);
  const [messageBody, setMessageBody] = useState("");

  useEffect(() => {
    if (MessagesScrollRef.current) {
      MessagesScrollRef.current.scrollBy({
        top: MessagesScrollRef.current.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  });

  const submitHandler = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      alert("Empty Message...!");
    } else {
      socket.emit("messages", {
        body: messageBody,
        from: currentName,
      });
      setMessageBody("");
    }
  };

  return (
    <div className="chatbox">
      <Card>
        <Card.Body>
          <Row>
            <Col>
              <strong>{currentRoom}</strong>
            </Col>
          </Row>
          <hr />
          <ListGroup className="list" ref={MessagesScrollRef}>
            {messages.map((message, index) => (
              <ListGroup.Item key={index}>
                {message.from === "System" ? (
                  <>
                    <strong>
                      {message.from}: {message.body}
                    </strong>
                  </>
                ) : (
                  <>
                    {message.from === currentName ? (
                      <>
                        <p>Me: {message.body}</p>
                      </>
                    ) : (
                      <>
                        <p>
                          {message.from}: {message.body}
                        </p>
                      </>
                    )}
                  </>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
          <form onSubmit={submitHandler}>
            <InputGroup className="col-6">
              <FormControl
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                placeholder="New Message..."
              ></FormControl>
              <Button variant="success" type="submit">
                Send
              </Button>
            </InputGroup>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ChatBox;
