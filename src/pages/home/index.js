import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Container } from "react-bootstrap";
import img from "./../../assets/images/FoodForLife.png";
import { useHistory, useLocation } from "react-router";

import { isLogedIn } from "../../utilities/storage";
import { Map } from "../../components/map";

const Home = () => {
  const history = useHistory();
  const location = useLocation();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        // background: "#eee2dc",
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
              onClick={() => {
                if (isLogedIn()) history.push({ pathname: "/bookmeal" });
                else
                  history.push({
                    pathname: "/signin",
                    state: { toPage: "/bookmeal" },
                  });
              }}
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
