import { Button } from "react-bootstrap";
import React, { useState } from "react";
import firebase from "../../services/firebaseConfig";

const DataCreater = () => {
  const [stop, setstop] = useState(false);
  const [count, setcount] = useState(0);
  const [data, setdata] = useState({});

  const setMealAPI = async () => {
    if (!stop) {
      const db = firebase.firestore();
      db.collection("mealRequests")
        .doc()
        .set({
          name: "Test Data",
          phone: 9717104597,
          email: "krida.space@gmail.com",
          address: "address",
          address_detail: "addressDetail",
          geopoint: "geoPoint",
          userid: firebase.auth().currentUser.uid,
          dinner: true,
          lunch: true,
          quantity: 56,
          remark: "remark",
          timestamp: new firebase.firestore.Timestamp.fromDate(new Date()),
        })
        .then((result) => {
          setcount((prevState) => {
            return prevState + 1;
          });
          setMealAPI();
        })
        .catch((error) => {
          console.log("error ", error.message);
        });
    }
  };

  const setRelationdata = async () => {
    const db = firebase
      .database()
      .ref("mealRequests1")
      .push({
        name: "Test Data",
        phone: 9717104597,
        email: "krida.space@gmail.com",
        address: "address",
        address_detail: "addressDetail",
        geopoint: "geoPoint",
        userid: firebase.auth().currentUser.uid,
        dinner: true,
        lunch: true,
        quantity: 56,
        remark: "remark",
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      })
      .then(() => {
        setcount((prevState) => {
          return prevState + 1;
        });
        setRelationdata();
      });
  };

  const getRelationdata = async () => {
    const db = firebase
      .database()
      .ref("mealRequests1")
      .once("value")
      .then((result) => {
        setdata(result.val());
        setcount(result.numChildren());
        result.forEach((data) => {
          console.log(new Date(data.val().timestamp).getMilliseconds());
        });
      });
  };
  const deleteRelationdata = async () => {
    firebase
      .database()
      .ref("mealRequests1")
      .once("value")
      .then((result) => {
        result.forEach((data) => {
          setcount((prevState) => {
            return prevState + 1;
          });
          firebase
            .database()
            .ref("mealRequests1/" + data.key)
            .remove();
        });
      });
  };

  const deleteData = async () => {
    const db = firebase
      .firestore()
      .collection("mealRequests")
      .where("userid", "==", firebase.auth().currentUser.uid);

    db.get().then((result) => {
      result.forEach((element) => {
        element.ref.delete();
      });
    });
  };

  return (
    <div>
      <Button onClick={setMealAPI}>Start</Button>
      <Button onClick={() => setstop(true)}>Stop</Button>
      <Button onClick={deleteData}>Delete</Button>
      <Button onClick={setRelationdata}>Start Relation</Button>
      <Button onClick={getRelationdata}>get Relation</Button>
      <Button onClick={deleteRelationdata}>delete Relation</Button>
      <Button onClick={reedData}>read file</Button>
      <div style={{ color: "white" }}>{count}</div>
      <div style={{ color: "white" }}>{JSON.stringify(data)}</div>
    </div>
  );
};

export default DataCreater;
