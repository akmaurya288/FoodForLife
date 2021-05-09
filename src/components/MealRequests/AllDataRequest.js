import React, { useEffect, useState, useRef } from "react";
import { Button, Card, Spinner, Tabs, Tab, Pagination } from "react-bootstrap";
import { useHistory } from "react-router";
import firebase from "../../services/firebaseConfig";
import { CSVLink } from "react-csv";
import styled from "styled-components";
import { getWhichMealTab, setWhichMealTab } from "../../utilities/storage";
import "./index.css";
import InfiniteScroll from "react-infinite-scroller";

const AllDataRequest = () => {
  const history = useHistory();
  const [loading, setloading] = useState(true);
  const [allData, setallData] = useState([]);
  const pageSize = 4;
  const [allShowPagination, setallShowPagination] = useState(false);
  const [allPagination, setallPagination] = useState(1);
  const [allPageNextAvailable, setallPageNextAvailable] = useState(false);
  const [allPagePrevAvailable, setallPagePrevAvailable] = useState(false);
  const [allLastSeen, setallLastSeen] = useState("");
  const [allFirstSeen, setallFirstSeen] = useState("");
  const [referenceNode, setReferenceNode] = useState();
  const scrollRef = useRef();
  const [canCallApi, setCanCallApi] = useState(true);
  const lastPos = useRef("");

  const allDBInstance = firebase
    .firestore()
    .collection("mealRequests")
    .limit(pageSize)
    .orderBy("timestamp", "desc");

  //   var handleScroll = (event) => {
  //     var node = event.target;
  //     const bottom = node.scrollHeight - node.scrollTop === node.clientHeight;
  //     // if (bottom) {
  //     //   AllData();
  //     // }
  //   };
  console.log("qiouweyuioghauf", allData);

  useEffect(() => {
    // scrollRef.current.addEventListener("scroll", handleScroll);
    AllData();
    // return () => scrollRef.current.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapData = (data) => {
    var temp = [];
    data.forEach((element) => {
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
    return temp;
  };

  const AllData = async () => {
    if (canCallApi) {
      setCanCallApi(false);
      firebase
        .firestore()
        .collection("mealRequests")
        .limit(pageSize)
        .orderBy("timestamp", "desc")
        .startAfter(lastPos.current)
        .get()
        .then((result) => {
          if (result.docs.length > 0) {
            if (result.docs.length < pageSize) setallPageNextAvailable(false);
            else setallPageNextAvailable(true);
            lastPos.current = result.docs[
              result.docs.length - 1
            ].data().timestamp;

            setloading(false);
            var data = mapData(result.docs);

            setallData(allData.concat(data));
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

  const AllDataPageNext = async () => {
    setloading(true);

    allDBInstance
      .startAfter(allLastSeen)
      .get()
      .then((result) => {
        if (result.docs.length > 0) {
          if (result.docs.length < pageSize) setallPageNextAvailable(false);
          else setallPageNextAvailable(true);
          setallPagePrevAvailable(true);
          setallLastSeen(result.docs[result.docs.length - 1].data().timestamp);
          setallFirstSeen(result.docs[0].data().timestamp);

          setallPagination(allPagination + 1);
          setloading(false);
          setallData(mapData(result.docs));
        } else {
          setallPageNextAvailable(false);
          setloading(false);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const AllDataPagePrev = async () => {
    setloading(true);

    allDBInstance
      .endBefore(allFirstSeen)
      .get()
      .then((result) => {
        console.log(result.docs.length);
        if (result.docs.length > 0) {
          if (result.docs.length < pageSize) setallPageNextAvailable(false);
          else setallPageNextAvailable(true);

          setallLastSeen(result.docs[result.docs.length - 1].data().timestamp);
          setallFirstSeen(result.docs[0].data().timestamp);

          setallPagination(allPagination - 1);
          setloading(false);
          setallData(mapData(result.docs));
        } else {
          setallPageNextAvailable(false);
          setloading(false);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
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
            state: { item: item, mealType: "all" },
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
          <Card.Text>{meal}</Card.Text>{" "}
          {item.timestamp ? (
            <Card.Subtitle className="mb-2 text-muted">{date}</Card.Subtitle>
          ) : null}
        </Card.Body>
      </Card>
    );
  };

  return (
    <div
      style={{
        marginTop: 6,
        overflowY: "auto",
        height: window.innerHeight - 100,
      }}
    >
      {loading ? <SpinnerCont /> : null}
      <InfiniteScroll
        pageStart={0}
        loadMore={AllData}
        hasMore={allPageNextAvailable}
        useWindow={false}
        threshold={40}
        loader={<SpinnerCont key={0}></SpinnerCont>}
      >
        {allData
          ? allData.map((item, index) => {
              return (
                <CardItem key={index} item={item} index={index}></CardItem>
              );
            })
          : null}
      </InfiniteScroll>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: 24,
        }}
      >
        <Button style={{ background: "#469623" }} onClick={AllData}>
          More Data
        </Button>
        {/* <Pagination>
            <Pagination.First
              disabled={!allPagePrevAvailable}
              onClick={() => {
                setallPagination(1);
                AllData();
              }}
            />
            <Pagination.Prev
              disabled={!allPagePrevAvailable}
              onClick={() => {
                if (allPagination > 1) {
                  AllDataPagePrev();
                }
              }}
            />
            <Pagination.Item active>{allPagination}</Pagination.Item>
            <Pagination.Next
              disabled={!allPageNextAvailable}
              onClick={() => {
                AllDataPageNext();
              }}
            />
          </Pagination> */}
      </div>
    </div>
  );
};

export default AllDataRequest;
