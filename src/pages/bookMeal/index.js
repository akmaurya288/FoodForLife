import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  InputGroup,
  FormControl,
  Modal,
  Spinner,
} from "react-bootstrap";
import { useHistory } from "react-router";
import firebase from "../../services/firebaseConfig";
import MapWithSearch from "../../components/map/mapWithSearch";
import { SiGooglemaps } from "react-icons/si";
import "./index.css";

const BookMeal = () => {
  const history = useHistory();

  const [initLoading, setinitLoading] = useState(true);
  const [initLodingMessage, setinitLodingMessage] = useState("Loading...");
  const [canBook, setcanBook] = useState(false);
  const [alreadyBooked, setalreadyBooked] = useState(false);
  const [loading, setloading] = useState(false);

  const [userChanged, setuserChanged] = useState(false);
  const [name, setname] = useState("");
  const [isChangingAddress, setisChangingAddress] = useState(false);
  const [address, setaddress] = useState("");
  const [addressDetail, setaddressDetail] = useState("");
  const [geoPoint, setgeoPoint] = useState({ lat: 1, lng: 1 });
  const [phone, setphone] = useState("");

  const [lunch, setlunch] = useState(false);
  const [dinner, setdinner] = useState(false);
  const [quantityLunch, setQuantityLunch] = useState("");
  const [quantityDinner, setQuantityDinner] = useState("");
  const [remark, setremark] = useState("");

  const [addressValid, setaddressValid] = useState(false);
  const [nameValid, setnameValid] = useState(false);
  const [phoneValid, setphoneValid] = useState(false);
  const [quantityLunchValid, setquantityLunchValid] = useState(false);
  const [quantityDinnerValid, setquantityDinnerValid] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        if (
          new Date().getHours() >= process.env.REACT_APP_REG_START_TIME &&
          new Date().getHours() < process.env.REACT_APP_REG_END_TIME
        ) {
          checkPreviousOrder();
        }
      } else {
        setinitLodingMessage("Sign In Ananymously");
        firebase
          .auth()
          .signInAnonymously()
          .then(() => {
            setinitLodingMessage("Sign In Complete");
          })
          .catch((error) => {
            setinitLodingMessage("Sign In error retry by refreshing page");
          });
      }
    });
  }, []);

  const checkPreviousOrder = () => {
    setinitLodingMessage("Checking Previous orders");
    const db = firebase.firestore();

    var d = new Date(new Date().setDate(new Date().getDate() - 1));
    d.setHours(0, 0, 0, 0);

    db.collection("mealRequests")
      .where("userid", "==", firebase.auth().currentUser.uid)
      .where("timestamp", ">", new firebase.firestore.Timestamp.fromDate(d))
      .orderBy("timestamp", "desc")
      .get()
      .then((result) => {
        setinitLoading(false);
        if (!result.empty) {
          setalreadyBooked(true);
        } else {
          setcanBook(true);
          getUserAPI();
          setalreadyBooked(false);
        }
      })
      .catch((error) => {
        console.log("error ", error.message);
      });
  };

  const getUserAPI = () => {
    const db = firebase.firestore();
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((result) => {
        if (result.data()) {
          if (result.data().name) setname(result.data().name);
          if (result.data().address) setaddress(result.data().address);
          if (result.data().address_detail)
            setaddressDetail(result.data().address_detail);
          if (result.data().geopoint)
            setgeoPoint({
              lat: result.data().geopoint._lat,
              lng: result.data().geopoint._long,
            });
          if (result.data().phone) setphone(result.data().phone);
        }
      })
      .catch((error) => {
        console.log("error ", error.message);
      });
  };

  const setMealAPI = () => {
    const db = firebase.firestore();
    const batch = db.batch();

    const addMeal = db.collection("mealRequests").doc();
    batch.set(addMeal, {
      name: name,
      phone: phone,
      email: firebase.auth().currentUser.email,
      address: address,
      address_detail: addressDetail,
      geopoint: geoPoint,
      userid: firebase.auth().currentUser.uid,
      dinner: dinner,
      lunch: lunch,
      quantityLunch: quantityLunch,
      quantityDinner: quantityDinner,
      remark: remark,
      timestamp: new firebase.firestore.Timestamp.fromDate(new Date()),
      delivered_lunch: false,
      delivered_dinner: false,
    });

    let change = {
      totalFamily: firebase.firestore.FieldValue.increment(1),
    };
    if (lunch)
      change = {
        ...change,
        totalLunch: firebase.firestore.FieldValue.increment(quantityLunch),
      };
    if (dinner)
      change = {
        ...change,
        totalDinner: firebase.firestore.FieldValue.increment(quantityDinner),
      };
    console.log(quantityLunch, "  ", quantityDinner);
    let date = new Date().toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });

    const incCount = db.collection("meal_details").doc(date);
    batch.update(incCount, change);
    batch
      .commit()
      .then(() => {
        history.push("/mymeal");
      })
      .catch((error) => {
        console.log("error ", error.message);
      });
  };
  const setUserAPI = () => {
    const db = firebase.firestore();
    db.collection("users")
      .doc(firebase.auth().currentUser.uid)
      .set({
        name: name,
        phone: phone,
        email: firebase.auth().currentUser.email,
        address: address,
        address_detail: addressDetail,
        geopoint: new firebase.firestore.GeoPoint(geoPoint.lat, geoPoint.lng),
        timestamp: firebase.firestore.Timestamp.fromDate(new Date()),
        lastorder: firebase.firestore.Timestamp.fromDate(new Date()),
      })
      .then((result) => {
        // console.log(result.data());
      })
      .catch((error) => {
        console.log("error ", error.message);
      });
  };

  const submitRequest = () => {
    var valid = true;
    if (name.length < 4) {
      valid = false;
      setnameValid(true);
    } else setnameValid(false);

    if (phone.length < 10) {
      valid = false;
      setphoneValid(true);
    } else setphoneValid(false);

    if (address.length < 8) {
      valid = false;
      setaddressValid(true);
    } else setaddressValid(false);

    if (dinner && quantityDinner < 1) {
      valid = false;
      setquantityDinnerValid(true);
    } else setquantityDinnerValid(false);

    if (lunch && quantityLunch < 1) {
      valid = false;
      setquantityLunchValid(true);
    } else setquantityLunchValid(false);

    if (!lunch && !dinner) {
      valid = false;
      setquantityLunchValid(true);
      setquantityDinnerValid(true);
    }

    if (valid) {
      setMealAPI();
      if (userChanged) setUserAPI();
    }
  };

  const changeAddress = () => {
    setisChangingAddress(!isChangingAddress);
    setuserChanged(true);
  };

  const mapChangeHandler = (address, lat, lng) => {
    console.log(address, "  ", lat, "  ", lng);
    setaddress(address);
    setgeoPoint({ lat: lat, lng: lng });
    setisChangingAddress(false);
  };

  const MapPopUp = ({ show, onHide }) => {
    return (
      <Modal
        show={show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="map-modal"
        onHide={onHide}
      >
        <MapWithSearch confirm={mapChangeHandler}></MapWithSearch>
      </Modal>
    );
  };

  return (
    <div style={{ marginTop: 25, marginBottom: 64, padding: 8 }}>
      <MapPopUp
        show={isChangingAddress}
        onHide={() => {
          setisChangingAddress(false);
        }}
      ></MapPopUp>
      <Container
        style={{
          background: "#93d243",
          boxShadow: "1px 1px 1px",
          borderRadius: 6,
          paddingLeft: 12,
          paddingRight: 12,
          paddingBottom: 24,
          paddingTop: 1,
          maxWidth: 700,
        }}
      >
        {canBook ? (
          <Form>
            <Form.Group style={{ marginTop: 24 }} controlId="formBasicName">
              <Form.Label style={{ marginLeft: 6 }}>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={(val) => {
                  setname(val.target.value);
                  setuserChanged(true);
                }}
                placeholder="Name"
                isInvalid={nameValid}
              />
              <Form.Control.Feedback type="invalid">
                Please enter valid name.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formBasicPhone">
              <Form.Label style={{ marginLeft: 6 }}>Phone Number</Form.Label>
              <Form.Control
                type="text"
                value={phone}
                onChange={(val) => {
                  setphone(val.target.value);
                  setuserChanged(true);
                }}
                placeholder="+919999999999"
                isInvalid={phoneValid}
              />
            </Form.Group>
            <Form.Group style={{ marginTop: 24 }} controlId="formBasicName">
              <Form.Label style={{ marginLeft: 6 }}>
                Detailed Address
              </Form.Label>
              <Form.Control
                type="text"
                value={addressDetail}
                onChange={(val) => {
                  setaddressDetail(val.target.value);
                  setuserChanged(true);
                }}
                placeholder="Address Details"
              />
            </Form.Group>
            <Form.Label style={{ marginLeft: 6 }}>
              Google Map (Set Location nearest to your home)
            </Form.Label>
            <InputGroup className="mb-3">
              <FormControl
                disabled
                as="textarea"
                rows={3}
                value={address}
                placeholder="Address"
                aria-label="Address"
                aria-describedby="basic-addon2"
                isInvalid={addressValid}
              />
              <InputGroup.Append>
                <Button size="sm" variant="primary" onClick={changeAddress}>
                  <SiGooglemaps
                    style={{ fontSize: "2rem", margin: 12 }}
                  ></SiGooglemaps>
                </Button>
              </InputGroup.Append>
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Checkbox
                  defaultChecked={lunch}
                  onChange={() => setlunch((preState) => !preState)}
                />
              </InputGroup.Prepend>
              <InputGroup.Prepend>
                <InputGroup.Text> Lunch </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="number"
                value={quantityLunch}
                onChange={(val) => setQuantityLunch(val.target.value)}
                placeholder="Please enter how many plates required"
                isInvalid={quantityLunchValid}
                disabled={!lunch}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Checkbox
                  defaultChecked={dinner}
                  onChange={() => setdinner((preState) => !preState)}
                />
              </InputGroup.Prepend>
              <InputGroup.Prepend>
                <InputGroup.Text> Dinner </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                type="number"
                value={quantityDinner}
                onChange={(val) => setQuantityDinner(val.target.value)}
                placeholder="Please enter how many plates required"
                isInvalid={quantityDinnerValid}
                disabled={!dinner}
              />
            </InputGroup>

            <Form.Group style={{ marginTop: 24 }} controlId="formBasicRemark">
              <Form.Label style={{ marginLeft: 6 }}>Remark</Form.Label>
              <Form.Control
                as="textarea"
                onChange={(val) => setremark(val.target.value)}
                rows={3}
              />
            </Form.Group>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                style={{ marginTop: 24 }}
                variant="primary"
                onClick={submitRequest}
              >
                {loading ? (
                  <Spinner
                    as="span"
                    animation="grow"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : null}
                Submit
              </Button>
            </div>
          </Form>
        ) : (
          <div>
            {initLoading ? (
              <div
                style={{
                  display: "flex",
                  height: 200,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spinner animation="border" variant="success" />
                <div>{initLodingMessage}</div>
              </div>
            ) : (
              <div>
                {alreadyBooked ? (
                  <div>
                    <div>Already placed an order today. </div>
                    <div>Go to My Meal Section to see your order.</div>
                    <Button
                      style={{ marginTop: 24 }}
                      onClick={() => history.push("/mymeal")}
                    >
                      My Meal
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div>Order Timing:</div>
                    <div>3:00 PM to 11:00 PM</div>
                    <div>Order must be placed 1 day before delivery date</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default BookMeal;
