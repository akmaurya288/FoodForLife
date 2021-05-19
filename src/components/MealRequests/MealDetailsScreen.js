import React, { useEffect, useState } from "react";
import { Button, Container, Form, Spinner } from "react-bootstrap";
import firebase from "../../services/firebaseConfig";

const MealDetailsScreen = () => {
  const [date, setDate] = useState(
    new Date().toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  );
  const [data, setdata] = useState({});
  const [noData, setnoData] = useState(true);
  const [loading, setloading] = useState(false);

  useEffect(() => {
    callAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callAPI = async () => {
    setloading(true);
    firebase
      .firestore()
      .collection("meal_details")
      .doc(date)
      .get()
      .then((result) => {
        console.log(result.data());
        if (result.data()) {
          setdata(result.data());
          setnoData(false);
        } else setnoData(true);
        setloading(false);
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

  return (
    <div>
      <div style={{ display: "flex", margin: 20 }}>
        <Form.Control
          type="date"
          value={date}
          name="date"
          onChange={(e) => {
            setDate(e.target.value);
          }}
          // error={}
          // ref={}
        />
        <Button
          onClick={callAPI}
          style={{
            marginLeft: 10,
            background: "#469623",
            borderColor: "#1f2223",
          }}
        >
          Show
        </Button>
      </div>
      {loading ? (
        <SpinnerCont />
      ) : (
        <div>
          {noData ? (
            <div style={{ color: "white" }}>No Data Available</div>
          ) : (
            <Container>
              <div style={{ color: "white", padding: 8 }}>
                Total Lunch Requests: {data.totalLunch}
              </div>
              <div style={{ color: "white", padding: 8 }}>
                Total Dinner Requests: {data.totalDinner}
              </div>
              <div style={{ color: "white", padding: 8 }}>
                Number of Families: {data.totalFamily}
              </div>
            </Container>
          )}
        </div>
      )}
    </div>
  );
};

export default MealDetailsScreen;
