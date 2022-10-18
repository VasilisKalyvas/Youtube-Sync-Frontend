import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";

const OnlineBox = ({ online }) => {
  return (
    <div style={{ width: "350px" }}>
      {online && (
        <Card>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Card.Title
              style={{
                display: "flex",
                marginTop: "10px",
                justifyContent: "center",
              }}
            >
              Online
            </Card.Title>
            <ListGroup>
              {online?.map((user, index) => (
                <ListGroup.Item
                  key={index}
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  {user.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </Card>
      )}
    </div>
  );
};

export default OnlineBox;
