import React, { useEffect, useState } from "react";
import { Button, Card, Container, Spinner } from "react-bootstrap";
import { useHistory } from "react-router";
import firebase from "../../services/firebaseConfig";

const MyMeal = () => {
  const history = useHistory();
  const [mealData, setmealData] = useState([]);
  const [oldMealData, setoldMealData] = useState([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        getMealAPI();
      } else {
      }
    });
  }, []);

  const getMealAPI = () => {
    setloading(true);
    const db = firebase.firestore();
    db.collection("mealRequests")
      .where("userid", "==", firebase.auth().currentUser.uid)
      .orderBy("timestamp", "desc")
      .get()
      .then((result) => {
        var temp = [];
        var tempOld = [];
        result.docs.forEach((element) => {
          let data = element.data();

          if (
            new Date(data.timestamp.toDate()).setHours(0, 0, 0, 0) ===
            new Date().setHours(0, 0, 0, 0)
          )
            temp.push({ ...data, id: element.id });
          else tempOld.push({ ...data, id: element.id });
        });
        console.log(temp);
        setmealData(temp);
        setoldMealData(tempOld);
        setloading(false);
      })
      .catch((error) => {
        console.log("error ", error.message);
      });
  };

  const GetDelivered = ({ delivered, onway, meal }) => {
    if (delivered)
      return (
        <div
          style={{
            paddingLeft: 6,
            paddingRight: 6,
            background: "#469623",
            borderRadius: 4,
            marginLeft: 6,
            fontSize: "0.85rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            height: "1.2rem",
          }}
        >
          {meal} Delivered
        </div>
      );
    if (onway && !delivered)
      return (
        <div
          style={{
            paddingLeft: 6,
            paddingRight: 6,
            background: "#469623",
            borderRadius: 4,
            marginLeft: 6,
            fontSize: "0.85rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            height: "1.2rem",
          }}
        >
          {meal} On the way
        </div>
      );
    return <div></div>;
  };

  const CardItem = ({ item, index }) => {
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
          margin: 6,
          marginTop: 16,
          borderRadius: 4,
          boxShadow: "1px 1px 1px 1px black",
          background: "#1f2223",
          color: "white",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            display: "flex",
            flexDirection: "row",
          }}
        >
          <GetDelivered
            delivered={item.delivered_lunch}
            onway={item.onway_lunch}
            meal="Lunch"
          ></GetDelivered>

          <GetDelivered
            delivered={item.delivered_dinner}
            onway={item.onway_dinner}
            meal="Dinner"
          ></GetDelivered>
        </div>

        <Card.Body>
          <Card.Title>{meal}</Card.Title>
          {item.timestamp ? (
            <Card.Subtitle className="mb-2 text-muted">{date}</Card.Subtitle>
          ) : null}
          {item.remark && item.remark !== "" ? (
            <Card.Text style={{ fontSize: ".9rem" }}>{item.remark}</Card.Text>
          ) : null}
          <div style={{ paddingTop: 12 }}>
            <Button
              size="sm"
              onClick={() => {
                history.push({
                  pathname: `/mymeal/${item.id}`,
                  state: { item },
                });
              }}
              style={{
                marginRight: 24,
                background: "#469623",
                borderWidth: 0,
              }}
            >
              Details
            </Button>
            {canEdit ? (
              <Button
                size="sm"
                onClick={() => {
                  history.push(`/bookMeal/edit/${item.id}`);
                }}
                style={{
                  marginRight: 24,
                  background: "#469623",
                  borderWidth: 0,
                }}
              >
                Edit
              </Button>
            ) : null}
          </div>
        </Card.Body>
      </Card>
    );
  };

  const SpinnerCont = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Spinner animation="border" variant="success" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  };

  return (
    <div style={{ marginTop: 20, marginBottom: 64 }}>
      <div
        style={{
          width: 100,
          background: "#469623",
          color: "white",
          padding: 6,
          marginLeft: 12,
          marginBottom: 24,
          borderRadius: 4,
          boxShadow: "1px 1px 1px black",
          cursor: "pointer",
        }}
        onClick={() => {
          history.push("/bookmeal");
        }}
      >
        Order Meal
      </div>
      {loading ? (
        <SpinnerCont />
      ) : (
        <div>
          {mealData
            ? mealData.map((item, index) => {
                return (
                  <CardItem key={index} item={item} index={index}></CardItem>
                );
              })
            : null}
          {oldMealData.length > 0 ? (
            <div
              style={{
                color: "white",
                marginLeft: 12,
                marginTop: 40,
                fontWeight: "bold",
              }}
            >
              Old Meal Requests
            </div>
          ) : null}
          {oldMealData
            ? oldMealData.map((item, index) => {
                return (
                  <CardItem key={index} item={item} index={index}></CardItem>
                );
              })
            : null}
        </div>
      )}
    </div>
  );
};

export default MyMeal;
