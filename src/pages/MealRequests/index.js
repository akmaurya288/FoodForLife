import React, { useEffect, useState } from "react";
import { Button, Card, Spinner, Tabs, Tab } from "react-bootstrap";
import { useHistory } from "react-router";
import firebase from "../../services/firebaseConfig";
import { CSVLink } from "react-csv";
import styled from "styled-components";
import { getWhichMealTab, setWhichMealTab } from "../../utilities/storage";
import "./index.css";

const MealRequests = () => {
  const history = useHistory();
  const [mealData, setmealData] = useState([]);
  const [lunchData, setlunchData] = useState([]);
  const [dinnerData, setdinnerData] = useState([]);
  const [loading, setloading] = useState(true);
  // const [allData, setallData] = useState(false);
  const [createdCSV, setcreatedCSV] = useState(false);
  const [csvData, setcsvData] = useState([]);
  const [mealTab, setmealTab] = useState(getWhichMealTab());

  useEffect(() => {
    TodayData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const TodayData = async () => {
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
        var tempM = [];
        var tempL = [];
        var tempD = [];
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
          tempM.push(data);
          if (data.lunch) tempL.push(data);
          if (data.dinner) tempD.push(data);
        });

        setloading(false);
        setmealData(tempM);
        setlunchData(tempL);
        setdinnerData(tempD);
        // setallData(false);
        setcreatedCSV(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // const AllData = async () => {
  //   const db = firebase.firestore();
  //   var d = new Date(new Date().setDate(new Date().getDate() - 1));
  //   d.setHours(0, 0, 0, 0);
  //   db.collection("mealRequests")
  //     .orderBy("timestamp", "desc")
  //     .get()
  //     .then((result) => {
  //       var tempM = [];
  //       result.docs.forEach((element) => {
  //         tempM.push({
  //           name: element.data().name,
  //           phone: element.data().phone,
  //           email: element.data().email ? element.data().email : "",
  //           address: element.data().address,
  //           address_detail: element.data().address_detail,
  //           geopoint: element.data().geopoint,
  //           userid: element.data().userid,
  //           dinner: element.data().dinner,
  //           lunch: element.data().lunch,
  //           quantity: element.data().quantity,
  //           remark: element.data().remark,
  //           timestamp: element.data().timestamp,
  //           delivered: element.data().delivered ? true : false,
  //           onway: element.data().onway ? true : false,
  //           id: element.id,
  //         });
  //       });
  //       setloading(false);
  //       setmealData(tempM);
  //       setallData(true);
  //       setcreatedCSV(false);
  //     })
  //     .catch((error) => {
  //       console.log(error.message);
  //     });
  // };

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
        <CSVLink data={csvData} style={{ color: "white" }}>
          Download
        </CSVLink>
      </ButtonStyled>
    );
  };

  const LunchTabCont = () => {
    return (
      <>
        {loading ? <SpinnerCont /> : null}
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
        {loading ? <SpinnerCont /> : null}
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
        {loading ? <SpinnerCont /> : null}
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
    <div style={{ marginTop: 10, marginBottom: 64 }}>
      <Tabs
        className="nav"
        id="controlled-tab-example"
        activeKey={mealTab}
        onSelect={(k) => {
          setmealTab(k);
          setWhichMealTab(k);
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
        <Tab eventKey="all" title="All" disabled></Tab>
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
