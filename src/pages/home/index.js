import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Container } from "react-bootstrap";
import img from "./../../assets/images/FoodForLife.png";
import { useHistory, useLocation } from "react-router";

const Home = () => {
  const history = useHistory();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginTop: 50,
      }}
    >
      <Container style={{ maxWidth: 400 }}>
        <Card
          style={{
            margin: 12,
            borderRadius: 4,
            boxShadow: "1px 1px 1px 1px black",
            background: "#1f2223",
            color: "white",
          }}
        >
          <Card.Img variant="top" src={img} />
          <Card.Body>
            <Button
              variant="primary"
              onClick={() => history.push({ pathname: "/bookmeal" })}
            >
              Order Free Meal
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Home;
