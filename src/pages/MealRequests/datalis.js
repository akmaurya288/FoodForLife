import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useHistory, useLocation } from "react-router";
import { SiGooglemaps } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import { HiPhone } from "react-icons/hi";
import firebase from "../../services/firebaseConfig";
import styled from "styled-components";

const MealDetails = () => {
  const history = useHistory();
  const location = useLocation();
  const [details, setdetails] = useState();
  const [mealType, setmealType] = useState(0);

  useEffect(() => {
    if (location.state && location.state.item) {
      setdetails(location.state.item);
      setmealType(location.state.mealType);
    } else history.goBack();
  }, []);

  const setDelivered = (id) => {
    var data = {};
    if (mealType === "lunch") data = { delivered_lunch: true };
    if (mealType === "dinner") data = { delivered_dinner: true };
    const db = firebase.firestore();
    db.collection("mealRequests")
      .doc(id)
      .set(data, { merge: true })
      .then((result) => {
        history.goBack();
      })
      .catch((error) => {
        console.log("error ", error.message);
      });
  };

  const setOnWay = (id) => {
    var data = {};
    if (mealType === "lunch") data = { onway_lunch: true };
    if (mealType === "dinner") data = { onway_dinner: true };
    const db = firebase.firestore();
    db.collection("mealRequests")
      .doc(id)
      .set(data, { merge: true })
      .then((result) => {
        history.goBack();
      })
      .catch((error) => {
        console.log("error ", error.message);
      });
  };

  const CardItem = ({ item }) => {
    var meal = "";
    if (item.lunch) meal = "Lunch  - " + item.quantityLunch;
    if (item.dinner) meal = "Dinner  - " + item.quantityDinner;
    if (item.lunch && item.dinner)
      meal =
        "Lunch - " + item.quantityLunch + " & Dinner - " + item.quantityDinner;
    const timeStampDate = item.timestamp;
    const dateInMillis = timeStampDate.seconds * 1000;
    var date =
      new Date(dateInMillis).toDateString() +
      " at " +
      new Date(dateInMillis).toLocaleTimeString();

    return (
      <Card
        style={{
          borderRadius: 4,
          boxShadow: "1px 1px 1px 1px black",
          background: "#1f2223",
          color: "white",
        }}
      >
        {item.delivered ? (
          <div
            style={{
              paddingLeft: 6,
              paddingRight: 6,
              background: "#469623",
              position: "absolute",
              borderRadius: 4,
              right: 12,
              top: 12,
            }}
          >
            Delivered
          </div>
        ) : null}
        {item.onway && !item.delivered ? (
          <div
            style={{
              paddingLeft: 6,
              paddingRight: 6,
              background: "#469623",
              position: "absolute",
              borderRadius: 4,
              right: 12,
              top: 12,
            }}
          >
            On The Way
          </div>
        ) : null}

        <Card.Body>
          <Card.Title>{item.name}</Card.Title>

          {item.email ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <div style={{ width: "88%" }}>
                <div
                  style={{
                    color: "#a0a0a0",
                    fontSize: "0.9rem",
                  }}
                >
                  Email
                </div>
                <div
                  style={{
                    color: "#fff",
                    marginBottom: 4,
                    fontSize: "1rem",
                  }}
                >
                  {item.email}
                </div>
              </div>
              <a
                href={`mailto:${item.email}`}
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: 30,
                  background: "#2b4723",
                  color: "#afe84f",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1rem",
                }}
              >
                <MdEmail />
              </a>
            </div>
          ) : null}

          {item.address ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <div style={{ width: "88%" }}>
                <div
                  style={{
                    color: "#a0a0a0",
                    fontSize: "0.9rem",
                  }}
                >
                  Address
                </div>
                <div
                  style={{
                    color: "#fff",
                    marginBottom: 4,
                    fontSize: "1rem",
                  }}
                >
                  {item.address}
                </div>
              </div>
              <div
                onClick={() => {
                  window.open("https://maps.google.com?q=" + item.address);
                }}
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: 30,
                  background: "#2b4723",
                  color: "#afe84f",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1rem",
                }}
              >
                <SiGooglemaps />
              </div>
            </div>
          ) : null}

          {item.address_detail ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <div style={{ width: "88%" }}>
                <div
                  style={{
                    color: "#a0a0a0",
                    fontSize: "0.9rem",
                  }}
                >
                  Address Detail
                </div>
                <div
                  style={{
                    color: "#fff",
                    marginBottom: 4,
                    fontSize: "1rem",
                  }}
                >
                  {item.address_detail}
                </div>
              </div>
            </div>
          ) : null}

          {item.phone ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <div style={{ width: "88%" }}>
                <div
                  style={{
                    color: "#a0a0a0",
                    fontSize: "0.9rem",
                  }}
                >
                  Phone
                </div>
                <div
                  style={{
                    color: "#fff",
                    marginBottom: 4,
                    fontSize: "1rem",
                  }}
                >
                  {item.phone}
                </div>
              </div>
              <a
                href={`tel:${item.phone}`}
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: 30,
                  background: "#2b4723",
                  color: "#afe84f",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1rem",
                }}
              >
                <HiPhone />
              </a>
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <div style={{ width: "88%" }}>
              <div
                style={{
                  color: "#a0a0a0",
                  fontSize: "0.9rem",
                }}
              >
                Meal Required
              </div>
              <div
                style={{
                  color: "#fff",
                  marginBottom: 4,
                  fontSize: "1rem",
                }}
              >
                {meal}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <div style={{ width: "88%" }}>
              <div
                style={{
                  color: "#a0a0a0",
                  fontSize: "0.9rem",
                }}
              >
                Total meal
              </div>
              <div
                style={{
                  color: "#fff",
                  marginBottom: 4,
                  fontSize: "1rem",
                }}
              >
                {parseInt(item.quantityLunch) + parseInt(item.quantityDinner)}
              </div>
            </div>
          </div>

          {item.timestamp ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <div style={{ width: "88%" }}>
                <div
                  style={{
                    color: "#a0a0a0",
                    fontSize: "0.9rem",
                  }}
                >
                  Timestamp
                </div>
                <div
                  style={{
                    color: "#fff",
                    marginBottom: 4,
                    fontSize: "1rem",
                  }}
                >
                  {date}
                </div>
              </div>
            </div>
          ) : null}

          {item.remark ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <div style={{ width: "88%" }}>
                <div
                  style={{
                    color: "#a0a0a0",
                    fontSize: "0.9rem",
                  }}
                >
                  Remark
                </div>
                <div
                  style={{
                    color: "#fff",
                    marginBottom: 4,
                    fontSize: "1rem",
                  }}
                >
                  {item.remark}
                </div>
              </div>
            </div>
          ) : null}
        </Card.Body>
        {mealType === "lunch" ? (
          <ButtonGroubCont>
            {!item.delivered_lunch ? (
              <ButtonStyled
                onClick={() => setDelivered(item.id)}
                variant="secondary"
              >
                Delivered
              </ButtonStyled>
            ) : null}
            {!item.onway_lunch && !item.delivered_lunch ? (
              <ButtonStyled
                onClick={() => setOnWay(item.id)}
                variant="secondary"
              >
                On the Way
              </ButtonStyled>
            ) : null}
          </ButtonGroubCont>
        ) : null}
        {mealType === "dinner" ? (
          <ButtonGroubCont>
            {!item.delivered_dinner ? (
              <ButtonStyled
                onClick={() => setDelivered(item.id)}
                variant="secondary"
              >
                Delivered
              </ButtonStyled>
            ) : null}
            {!item.onway_dinner && !item.delivered_dinner ? (
              <ButtonStyled
                onClick={() => setOnWay(item.id)}
                variant="secondary"
              >
                On the Way
              </ButtonStyled>
            ) : null}
          </ButtonGroubCont>
        ) : null}
      </Card>
    );
  };

  return (
    <div style={{ marginTop: 20, marginBottom: 64 }}>
      {mealType === "lunch" ? <ListTypeHeading>Lunch</ListTypeHeading> : null}
      {mealType === "dinner" ? <ListTypeHeading>Dinner</ListTypeHeading> : null}
      {mealType === "both" ? (
        <ListTypeHeading>Both Lunch and Dinner</ListTypeHeading>
      ) : null}
      {details ? <CardItem item={details}></CardItem> : null}
    </div>
  );
};

export default MealDetails;

const ListTypeHeading = styled.div`
  margin: 8px 16px;
  font-size: 1.6rem;
  color: white;
`;

const ButtonGroubCont = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 16px;
  margin-bottom: 24px;
`;

const ButtonStyled = styled(Button)`
  margin: 8px;
`;
