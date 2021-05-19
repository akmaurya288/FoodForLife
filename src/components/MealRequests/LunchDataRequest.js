import React, { useEffect, useState, useRef } from "react";
import { Button, Card, Spinner } from "react-bootstrap";
import { useHistory } from "react-router";
import firebase from "../../services/firebaseConfig";
import "./index.css";
import InfiniteScroll from "react-infinite-scroller";
import { CSVLink } from "react-csv";
import styled from "styled-components";

const LunchDataRequest = () => {
  const history = useHistory();
  const [loading, setloading] = useState(true);
  const [data, setData] = useState([]);
  const pageSize = 10;
  const [allPageNextAvailable, setallPageNextAvailable] = useState(false);
  const [canCallApi, setCanCallApi] = useState(true);
  const lastPos = useRef("");
  const [createdCSV, setcreatedCSV] = useState(false);
  const [csvData, setcsvData] = useState([]);
  const [csvFileName, setcsvFileName] = useState("Meal_Request_List");
  const [spreadLoding, setspreadLoding] = useState(false);

  useEffect(() => {
    callAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapData = (data) => {
    var temp = [];
    data.forEach((element) => {
      var data = {
        ...element.data(),
        id: element.id,
      };
      temp.push(data);
    });
    return temp;
  };

  const callAPI = async () => {
    if (canCallApi) {
      setCanCallApi(false);

      var d = new Date(new Date().setDate(new Date().getDate() - 1));
      d.setHours(0, 0, 0, 0);
      var d2 = new Date(new Date().setDate(new Date().getDate()));
      d2.setHours(0, 0, 0, 0);

      firebase
        .firestore()
        .collection("mealRequests")
        // .where("timestamp", ">", new firebase.firestore.Timestamp.fromDate(d))
        // .where("timestamp", "<", new firebase.firestore.Timestamp.fromDate(d2))
        .where("lunch", "==", true)
        .where("delivered_lunch", "==", false)
        .limit(pageSize)
        .orderBy("timestamp", "desc")
        .startAfter(lastPos.current)
        .get()
        .then((result) => {
          if (result.docs.length > 0) {
            if (result.docs.length < pageSize) setallPageNextAvailable(false);
            else setallPageNextAvailable(true);
            lastPos.current =
              result.docs[result.docs.length - 1].data().timestamp;

            setloading(false);
            var dataList = mapData(result.docs);

            setData(data.concat(dataList));
            setCanCallApi(true);
          } else {
            setallPageNextAvailable(false);
            setloading(false);
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
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

    return (
      <Card
        onClick={() => {
          history.push({
            pathname: `/mealrequest/${item.id}`,
            state: { item: item, mealType: "lunch" },
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
          <GetDelivered
            delivered={item.delivered_lunch}
            onway={item.onway_lunch}
            meal="Lunch"
          ></GetDelivered>
        </div>

        <Card.Body>
          <Card.Title>{item.name}</Card.Title>
          {item.address ? (
            <Card.Subtitle className="mb-2 text-muted">
              {item.address}
            </Card.Subtitle>
          ) : null}
          <Card.Text>{meal}</Card.Text>
          {item.timestamp ? (
            <Card.Subtitle className="mb-2 text-muted">{date}</Card.Subtitle>
          ) : null}
        </Card.Body>
      </Card>
    );
  };

  const ToSpreadSheet = () => {
    var d = new Date(new Date().setDate(new Date().getDate() - 1));
    d.setHours(0, 0, 0, 0);
    var d2 = new Date(new Date().setDate(new Date().getDate()));
    d2.setHours(0, 0, 0, 0);
    setspreadLoding(true);
    firebase
      .firestore()
      .collection("mealRequests")
      // .where("timestamp", ">", new firebase.firestore.Timestamp.fromDate(d))
      // .where("timestamp", "<", new firebase.firestore.Timestamp.fromDate(d2))
      .where("lunch", "==", true)
      .orderBy("timestamp", "desc")
      .get()
      .then((result) => {
        var dataList = mapData(result.docs);
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

        setcsvFileName("lunch_list_" + new Date().toDateString());
        dataList.forEach((data) => {
          var meal = "";
          if (data.lunch) meal = "Lunch";

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
            data.quantityLunch,
          ]);
        });
        setcsvData(temp);
        setcreatedCSV(true);
        setspreadLoding(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const CSVButtonCont = () => {
    return (
      <ButtonStyled
        style={{ margin: 12, marginBottom: 0 }}
        size="sm"
        // onClick={() => setcreatedCSV(false)}
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

  return (
    <div
      style={{
        marginTop: 6,
        overflowY: "auto",
        height: window.innerHeight - 110,
      }}
    >
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
            {spreadLoding ? (
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            ) : null}
            Spreadsheet
          </ButtonStyled>
        )}
      </div>
      {loading ? <SpinnerCont /> : null}
      <InfiniteScroll
        pageStart={0}
        loadMore={callAPI}
        hasMore={allPageNextAvailable}
        useWindow={false}
        threshold={40}
        loader={<SpinnerCont key={0}></SpinnerCont>}
      >
        {data
          ? data.map((item, index) => {
              return (
                <CardItem key={index} item={item} index={index}></CardItem>
              );
            })
          : null}
      </InfiniteScroll>
    </div>
  );
};

export default LunchDataRequest;

const ButtonStyled = styled(Button)`
  margin: 8px;
`;
