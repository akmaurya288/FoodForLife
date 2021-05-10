import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useHistory, useLocation } from "react-router";
import { SiGooglemaps } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import { HiPhone } from "react-icons/hi";
import firebase from "../../services/firebaseConfig";

const MyMealDetails = () => {
  const history = useHistory();
  const location = useLocation();
  const [details, setdetails] = useState();

  useEffect(() => {
    if (location.state && location.state.item) setdetails(location.state.item);
    else history.goBack();
  }, []);

  const CardItem = ({ item }) => {
    var meal = "";
    if (item.lunch) meal = "Lunch  - " + item.quantity;
    if (item.dinner) meal = "Dinner  - " + item.quantity;
    if (item.lunch && item.dinner)
      meal = "Both(Lunch & Dinner)  - " + item.quantity;
    const timeStampDate = item.timestamp;
    const dateInMillis = timeStampDate.seconds * 1000;
    var date =
      new Date(dateInMillis).toDateString() +
      " at " +
      new Date(dateInMillis).toLocaleTimeString();

    var canEdit = false;
    if (
      item.timestamp.toDate().toDateString() === new Date().toDateString() &&
      new Date().getHours() >= process.env.REACT_APP_REG_START_TIME &&
      new Date().getHours() < process.env.REACT_APP_REG_END_TIME
    ) {
      if (!item.delivered && !item.onway) canEdit = true;
    }
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

          {item.address_detail != "" ? (
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
                How many persons meal requesting for?
              </div>
              <div
                style={{
                  color: "#fff",
                  marginBottom: 4,
                  fontSize: "1rem",
                }}
              >
                {item.quantity}
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
          {/* {canEdit ? (
            <div style={{ paddingTop: 12 }}>
              <Button
                size="sm"
                onClick={() => {
                  // history.push(`/bookMeal/edit/${mealDataId[index]}`);
                }}
                style={{ marginRight: 24 }}
                variant="success"
              >
                Edit
              </Button>
            </div>
          ) : null} */}
        </Card.Body>
      </Card>
    );
  };

  return (
    <div style={{ marginTop: 20, marginBottom: 64 }}>
      {details ? <CardItem item={details}></CardItem> : null}
    </div>
  );
};

export default MyMealDetails;
