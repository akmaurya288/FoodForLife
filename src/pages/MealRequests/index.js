import React, { useEffect, useState } from "react";
import { Button, Card, Spinner, Tabs, Tab } from "react-bootstrap";
import { useHistory } from "react-router";
import firebase from "../../services/firebaseConfig";
import { CSVLink } from "react-csv";
import styled from "styled-components";
import { getWhichMealTab, setWhichMealTab } from "../../utilities/storage";
import "./index.css";
import AllDataRequest from "../../components/MealRequests/AllDataRequest";

const MealRequests = () => {
  const history = useHistory();
  var height = window.innerHeight;
  const [mealData, setmealData] = useState([]);
  const [lunchData, setlunchData] = useState([]);
  const [dinnerData, setdinnerData] = useState([]);
  const [loading, setloading] = useState(true);
  const [createdCSV, setcreatedCSV] = useState(false);
  const [csvData, setcsvData] = useState([]);
  const [csvFileName, setcsvFileName] = useState("Meal_Request_List");
  const [mealTab, setmealTab] = useState(getWhichMealTab());

  useEffect(() => {
    if (mealTab === "lunch") TodayLunchData();
    if (mealTab === "dinner") TodayDinnerData();
    if (mealTab === "both") TodayBothData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const TodayLunchData = async () => {
    const db = firebase.firestore();
    var d = new Date(new Date().setDate(new Date().getDate() - 1));
    d.setHours(0, 0, 0, 0);
    var d2 = new Date(new Date().setDate(new Date().getDate()));
    d2.setHours(0, 0, 0, 0);
    db.collection("mealRequests")
      .where("timestamp", ">", new firebase.firestore.Timestamp.fromDate(d))
      .where("timestamp", "<", new firebase.firestore.Timestamp.fromDate(d2))
      .where("lunch", "==", true)
      .orderBy("timestamp", "desc")
      .get()
      .then((result) => {
        var temp = [];
        result.docs.forEach((element) => {
          var data = {
            name: element.data().name,
            phone: element.data().phone,
            email: element.data().email ? element.data().email : "",
            address: element.data().address,
            address_detail: element.data().address_detail,
            geopoint: element.data().geopoint,
            userid: element.data().userid,
            dinner: element.data().dinner,
            lunch: element.data().lunch,
            quantity: element.data().quantity,
            remark: element.data().remark,
            timestamp: element.data().timestamp,
            delivered_lunch: element.data().delivered_lunch ? true : false,
            onway_lunch: element.data().onway_lunch ? true : false,
            delivered_dinner: element.data().delivered_dinner ? true : false,
            onway_dinner: element.data().onway_dinner ? true : false,
            id: element.id,
          };
          temp.push(data);
        });

        setloading(false);
        setlunchData(temp);
        setcreatedCSV(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const TodayDinnerData = async () => {
    const db = firebase.firestore();
    var d = new Date(new Date().setDate(new Date().getDate() - 1));
    d.setHours(0, 0, 0, 0);
    var d2 = new Date(new Date().setDate(new Date().getDate()));
    d2.setHours(0, 0, 0, 0);
    db.collection("mealRequests")
      .where("timestamp", ">", new firebase.firestore.Timestamp.fromDate(d))
      .where("timestamp", "<", new firebase.firestore.Timestamp.fromDate(d2))
      .where("dinner", "==", true)
      .orderBy("timestamp", "desc")
      .get()
      .then((result) => {
        var temp = [];
        result.docs.forEach((element) => {
          var data = {
            name: element.data().name,
            phone: element.data().phone,
            email: element.data().email ? element.data().email : "",
            address: element.data().address,
            address_detail: element.data().address_detail,
            geopoint: element.data().geopoint,
            userid: element.data().userid,
            dinner: element.data().dinner,
            lunch: element.data().lunch,
            quantity: element.data().quantity,
            remark: element.data().remark,
            timestamp: element.data().timestamp,
            delivered_lunch: element.data().delivered_lunch ? true : false,
            onway_lunch: element.data().onway_lunch ? true : false,
            delivered_dinner: element.data().delivered_dinner ? true : false,
            onway_dinner: element.data().onway_dinner ? true : false,
            id: element.id,
          };
          temp.push(data);
        });

        setloading(false);
        setdinnerData(temp);
        setcreatedCSV(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const TodayBothData = async () => {
    const db = firebase.firestore();
    var d = new Date(new Date().setDate(new Date().getDate() - 1));
    d.setHours(0, 0, 0, 0);
    var d2 = new Date(new Date().setDate(new Date().getDate()));
    d2.setHours(0, 0, 0, 0);
    db.collection("mealRequests")
      .where("timestamp", ">", new firebase.firestore.Timestamp.fromDate(d))
      .where("timestamp", "<", new firebase.firestore.Timestamp.fromDate(d2))
      .orderBy("timestamp", "desc")
      .get()
      .then((result) => {
        var temp = [];
        result.docs.forEach((element) => {
          var data = {
            name: element.data().name,
            phone: element.data().phone,
            email: element.data().email ? element.data().email : "",
            address: element.data().address,
            address_detail: element.data().address_detail,
            geopoint: element.data().geopoint,
            userid: element.data().userid,
            dinner: element.data().dinner,
            lunch: element.data().lunch,
            quantity: element.data().quantity,
            remark: element.data().remark,
            timestamp: element.data().timestamp,
            delivered_lunch: element.data().delivered_lunch ? true : false,
            onway_lunch: element.data().onway_lunch ? true : false,
            delivered_dinner: element.data().delivered_dinner ? true : false,
            onway_dinner: element.data().onway_dinner ? true : false,
            id: element.id,
          };
          temp.push(data);
        });

        setloading(false);
        setmealData(temp);
        setcreatedCSV(false);
      })
      .catch((error) => {
        console.log(error.message);
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
    if (item.lunch) meal = "Lunch  - " + item.quantity;
    if (item.dinner) meal = "Dinner  - " + item.quantity;
    if (item.lunch && item.dinner)
      meal = "Both ( Lunch & Dinner )  - " + item.quantity;

    const timeStampDate = item.timestamp;
    const dateInMillis = timeStampDate.seconds * 1000;
    var date =
      new Date(dateInMillis).toDateString() +
      " at " +
      new Date(dateInMillis).toLocaleTimeString();

    return (
      <Card
        onClick={() => {
          history.push({
            pathname: `/mealrequest/${item.id}`,
            state: { item: item, mealType: mealTab },
          });
        }}
        style={{
          margin: 6,
          marginTop: 16,
          borderRadius: 4,
          boxShadow: "1px 1px 1px 1px black",
          background: "#1f2223",
          color: "white",
          cursor: "pointer",
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
          {mealTab === "lunch" ? (
            <GetDelivered
              delivered={item.delivered_lunch}
              onway={item.onway_lunch}
              meal="Lunch"
            ></GetDelivered>
          ) : null}
          {mealTab === "dinner" ? (
            <GetDelivered
              delivered={item.delivered_dinner}
              onway={item.onway_dinner}
              meal="Dinner"
            ></GetDelivered>
          ) : null}
          {mealTab === "both" ? (
            <GetDelivered
              delivered={item.delivered_lunch}
              onway={item.onway_lunch}
              meal="Lunch"
            ></GetDelivered>
          ) : null}
          {mealTab === "both" ? (
            <GetDelivered
              delivered={item.delivered_dinner}
              onway={item.onway_dinner}
              meal="Dinner"
            ></GetDelivered>
          ) : null}
        </div>

        <Card.Body>
          <Card.Title>{item.name}</Card.Title>
          {item.address ? (
            <Card.Subtitle className="mb-2 text-muted">
              {item.address}
            </Card.Subtitle>
          ) : null}
          <Card.Text>{meal}</Card.Text>{" "}
          {item.timestamp ? (
            <Card.Subtitle className="mb-2 text-muted">{date}</Card.Subtitle>
          ) : null}
          {/* {item.remark && item.remark !== "" ? (
            <Card.Text style={{ fontSize: ".9rem" }}>{item.remark}</Card.Text>
          ) : null} */}
        </Card.Body>
      </Card>
    );
  };

  const ToSpreadSheet = () => {
    var temp = [
      [
        "Address Line 1",
        "Address Line 2",
        "City",
        "State",
        "Postal Code",
        "Address Help",
        "name",
        "phone",
        "meal",
        "quantity",
      ],
    ];

    var dataList = [];
    if (mealTab === "lunch") dataList = lunchData;
    if (mealTab === "dinner") dataList = dinnerData;
    if (mealTab === "both") dataList = mealData;

    setcsvFileName(mealTab + "_list_" + new Date().toDateString());
    dataList.forEach((data) => {
      var meal = "";
      if (data.lunch) meal = "Lunch";
      if (data.dinner) meal = "Dinner";
      if (data.lunch && data.dinner) meal = "Both ( Lunch & Dinner )";

      temp.push([
        data.address,
        "",
        "gurgaon",
        "haryana",
        "",
        data.address_detail,
        data.name,
        data.phone,
        meal,
        data.quantity,
      ]);
    });
    setcsvData(temp);
    setcreatedCSV(true);
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

  const CSVButtonCont = () => {
    return (
      <ButtonStyled
        style={{ margin: 12, marginBottom: 0 }}
        size="sm"
        onClick={() => setcreatedCSV(false)}
        variant="success"
      >
        <CSVLink
          filename={csvFileName}
          data={csvData}
          style={{ color: "white" }}
        >
          Download
        </CSVLink>
      </ButtonStyled>
    );
  };

  const LunchTabCont = () => {
    return (
      <>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {createdCSV && csvData.length > 0 ? (
            <CSVButtonCont />
          ) : (
            <ButtonStyled
              style={{ margin: 12 }}
              size="sm"
              onClick={ToSpreadSheet}
              variant="success"
            >
              Spreadsheet
            </ButtonStyled>
          )}
        </div>
        {loading ? <SpinnerCont /> : null}
        {lunchData
          ? lunchData.map((item, index) => {
              return (
                <CardItem key={index} item={item} index={index}></CardItem>
              );
            })
          : null}
      </>
    );
  };

  const DinnerTabCont = () => {
    return (
      <>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {createdCSV && csvData.length > 0 ? (
            <CSVButtonCont />
          ) : (
            <ButtonStyled
              style={{ margin: 12 }}
              size="sm"
              onClick={ToSpreadSheet}
              variant="success"
            >
              Spreadsheet
            </ButtonStyled>
          )}
        </div>
        {loading ? <SpinnerCont /> : null}
        {dinnerData
          ? dinnerData.map((item, index) => {
              return (
                <CardItem key={index} item={item} index={index}></CardItem>
              );
            })
          : null}
      </>
    );
  };

  const BothTabCont = () => {
    return (
      <>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {createdCSV && csvData.length > 0 ? (
            <CSVButtonCont />
          ) : (
            <ButtonStyled
              style={{ margin: 12 }}
              size="sm"
              onClick={ToSpreadSheet}
              variant="success"
            >
              Spreadsheet
            </ButtonStyled>
          )}
        </div>
        {loading ? <SpinnerCont /> : null}
        {mealData
          ? mealData.map((item, index) => {
              return (
                <CardItem key={index} item={item} index={index}></CardItem>
              );
            })
          : null}
      </>
    );
  };

  return (
    <div
      style={{
        height: height - 60,
        overflow: "hidden",
      }}
    >
      <Tabs
        className="nav"
        id="controlled-tab-example"
        activeKey={mealTab}
        onSelect={(k) => {
          setmealTab(k);
          setWhichMealTab(k);
          if (k === "lunch") TodayLunchData();
          if (k === "dinner") TodayDinnerData();
          if (k === "both") TodayBothData();
        }}
      >
        <Tab eventKey="lunch" title="Lunch">
          <LunchTabCont />
        </Tab>
        <Tab eventKey="dinner" title="Dinner">
          <DinnerTabCont />
        </Tab>
        <Tab eventKey="both" title="Both">
          <BothTabCont />
        </Tab>
        <Tab eventKey="all" title="All">
          <AllDataRequest></AllDataRequest>
        </Tab>
      </Tabs>
    </div>
  );
};

export default MealRequests;

const ListTypeHeading = styled.div`
  margin: 12px;
  margin-top: 0px;
  font-size: 1.4rem;
  color: white;
`;

const ButtonStyled = styled(Button)`
  margin: 8px;
`;
