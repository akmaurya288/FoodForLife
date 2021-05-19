import React, { useEffect, useState, useRef } from "react";
/* global google */
import { Button, Card, Spinner } from "react-bootstrap";
import { useHistory } from "react-router";
import firebase from "../../services/firebaseConfig";
import "./index.css";
import InfiniteScroll from "react-infinite-scroller";
import { CSVLink } from "react-csv";
import styled from "styled-components";

const BothDataRequest = () => {
  const history = useHistory();
  const [loading, setloading] = useState(true);
  const [data, setData] = useState([]);
  const pageSize = 10;
  const [allPageNextAvailable, setallPageNextAvailable] = useState(false);
  const [canCallApi, setCanCallApi] = useState(true);
  const lastPos = useRef("");
  const [createdCSV, setcreatedCSV] = useState(false);
  const [allData, setallData] = useState([]);
  const [csvData, setcsvData] = useState([]);
  const [csvFileName, setcsvFileName] = useState("Meal_Request_List");
  const [spreadLoding, setspreadLoding] = useState(false);
  const [mapLink, setmapLink] = useState("");
  const [waypts, setwaypts] = useState([]);

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
        .where("dinner", "==", true)
        .where("lunch", "==", true)
        .where("delivered_dinner", "==", false)
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
            state: { item: item, mealType: "both" },
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
          <GetDelivered
            delivered={item.delivered_dinner}
            onway={item.onway_dinner}
            meal="Dinner"
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
  const allDataApi = () => {
    var d = new Date(new Date().setDate(new Date().getDate() - 1));
    d.setHours(0, 0, 0, 0);
    var d2 = new Date(new Date().setDate(new Date().getDate()));
    d2.setHours(0, 0, 0, 0);
    setspreadLoding(true);
    var promise = new Promise((resolve, reject) => {
      firebase
        .firestore()
        .collection("mealRequests")
        // .where("timestamp", ">", new firebase.firestore.Timestamp.fromDate(d))
        // .where("timestamp", "<", new firebase.firestore.Timestamp.fromDate(d2))
        // .where("dinner", "==", true)
        //   .where("lunch", "==", true)
        .orderBy("timestamp", "desc")
        .get()
        .then((result) => {
          var dataList = mapData(result.docs);
          setallData(dataList);
          resolve(dataList);
        })
        .catch((error) => {
          console.log(error.message);
        });
    });
    promise.then((result) => {
      ToSpreadSheet(result);
    });
  };

  const ToSpreadSheet = (dataList) => {
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

    setcsvFileName("both_list_" + new Date().toDateString());

    dataList.forEach((data) => {
      setwaypts((preState) => [
        ...preState,
        {
          location: { lat: data.geopoint.lat, lng: data.geopoint.lng },
          stopover: true,
        },
      ]);

      var meal = "";
      if (data.lunch) meal = "Lunch  - " + data.quantityLunch;
      if (data.dinner) meal = "Dinner  - " + data.quantityDinner;
      if (data.lunch && data.dinner)
        meal =
          "Lunch - " +
          data.quantityLunch +
          " & Dinner - " +
          data.quantityDinner;

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
        parseInt(data.quantityLunch) + parseInt(data.quantityDinner),
      ]);
    });

    setcsvData(temp);
    setcreatedCSV(true);
    setspreadLoding(false);
  };

  const RoutePostApi = () => {
    var data = [];
    allData.forEach((val) => {
      data.push(val.id);
    });

    let date = new Date(
      new Date().setDate(new Date().getDate())
    ).toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const db = firebase.firestore();
    db.collection("routes")
      .doc("route")
      .set({
        meal_type: "dinner",
        total_driver: 3,
        driver_1: data,
        driver_2: data,
        driver_3: data,
      })
      .then((result) => {})
      .catch((error) => {
        console.log("error ", error.message);
      });
  };

  const getWayPoint = () => {
    console.log(waypts);
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: { lat: 28.440917, lng: 77.062629 },
        destination: { lat: 28.440917, lng: 77.062629 },
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: false,
      },
      (response, status) => {
        console.log(response);
        if (status === "OK" && response) {
          let temp = "/28.440917,77.062629";
          response.routes[0].waypoint_order.forEach((val) => {
            console.log(val);
            let data = waypts[val].location;
            console.log(data.lat);
            console.log(data.lng);
            temp = `${temp}/${data.lat},${data.lng}`;
          });
          setmapLink(temp);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
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
      <a
        href={`https://www.google.com/maps/dir/dir_action=navigate&${mapLink}`}
      >
        Map
      </a>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {createdCSV && csvData.length > 0 ? (
          <div>
            <CSVButtonCont />
            <ButtonStyled
              style={{ margin: 12, marginBottom: 0 }}
              size="sm"
              onClick={RoutePostApi}
              variant="success"
            >
              Upload Meal
            </ButtonStyled>
            <ButtonStyled
              style={{ margin: 12, marginBottom: 0 }}
              size="sm"
              onClick={getWayPoint}
              variant="success"
            >
              Get Waypoint
            </ButtonStyled>
          </div>
        ) : (
          <ButtonStyled
            style={{ margin: 12, marginBottom: 0 }}
            size="sm"
            onClick={allDataApi}
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

export default BothDataRequest;

const ButtonStyled = styled(Button)`
  margin: 8px;
`;
