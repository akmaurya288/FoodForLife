import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  Row,
  Col,
  InputGroup,
  FormControl,
  Jumbotron,
  Modal,
} from "react-bootstrap";
import { useHistory } from "react-router";
import firebase from "../../services/firebaseConfig";
import MapWithSearch from "../../components/map/mapWithSearch";
import { SiGooglemaps } from "react-icons/si";
import "./index.js";

const EditMeal = ({ match }) => {
  const id = match.params.id;
  const history = useHistory();

  const [canEdit, setcanEdit] = useState(false);

  const [userChanged, setuserChanged] = useState(false);
  const [name, setname] = useState("");
  const [isChangingAddress, setisChangingAddress] = useState(false);
  const [address, setaddress] = useState("");
  const [addressDetail, setaddressDetail] = useState("");
  const [geoPoint, setgeoPoint] = useState({ lat: 1, lng: 1 });
  const [phone, setphone] = useState("");

  const [lunch, setlunch] = useState(true);
  const [dinner, setdinner] = useState(false);
  const [quantity, setquantity] = useState(0);
  const [remark, setremark] = useState("");

  const [addressValid, setaddressValid] = useState(false);
  const [nameValid, setnameValid] = useState(false);
  const [phoneValid, setphoneValid] = useState(false);

  const [quantityValid, setquantityValid] = useState(false);

  const [deletePopupShow, setdeletePopupShow] = useState(false);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        if (
          new Date().getHours() >= process.env.REACT_APP_REG_START_TIME &&
          new Date().getHours() < process.env.REACT_APP_REG_END_TIME
        ) {
          if (id) {
            GetMealRequest();
          } else history.goBack();
        }
      } else {
      }
    });
  }, []);

  const GetMealRequest = () => {
    const db = firebase.firestore();
    db.collection("mealRequests")
      .doc(id)
      .get()
      .then((result) => {
        var data = result.data();
        setname(data.name);
        setphone(data.phone);
        setaddress(data.address);
        setaddressDetail(data.address_detail);
        setgeoPoint(data.geopoint);
        setdinner(data.dinner);
        setlunch(data.lunch);
        setquantity(data.quantity);
        setremark(data.remark);
        setcanEdit(true);
      })
      .catch((error) => {
        console.log("error ", error.message);
      });
  };

  const setMealAPI = () => {
    const db = firebase.firestore();
    db.collection("mealRequests")
      .doc(id)
      .set({
        name: name,
        phone: phone,
        email: firebase.auth().currentUser.email,
        address: address,
        address_detail: addressDetail,
        geopoint: geoPoint,
        userid: firebase.auth().currentUser.uid,
        dinner: dinner,
        lunch: lunch,
        quantity: quantity,
        remark: remark,
        timestamp: new firebase.firestore.Timestamp.fromDate(new Date()),
      })
      .then((result) => {
        history.push("/mymeal");
        console.log(result.data());
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
        console.log(result.data());
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

    if (quantity < 1) {
      valid = false;
      setquantityValid(true);
    } else setquantityValid(false);

    console.log(geoPoint);
    if (valid) {
      setMealAPI();
      if (userChanged) setUserAPI();
    }
  };

  const mealHandler = (event) => {
    if (event.target.id === "lunch") {
      setlunch(true);
      setdinner(false);
    }
    if (event.target.id === "dinner") {
      setlunch(false);
      setdinner(true);
    }
    if (event.target.id === "both") {
      setlunch(true);
      setdinner(true);
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

  const deleteMealAPI = () => {
    const db = firebase.firestore();
    db.collection("mealRequests")
      .doc(id)
      .delete()
      .then((result) => {
        history.push("/mymeal");
      })
      .catch((error) => {
        console.log("error ", error.message);
      });
  };

  const DeletePopup = ({ show, onHide }) => {
    return (
      <Modal
        show={show}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="delete-modal"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Delete Meal Request
          </Modal.Title>
        </Modal.Header>

        <Modal.Footer>
          <Button onClick={() => setdeletePopupShow(false)}>Close</Button>
          <Button variant="danger" onClick={() => deleteMealAPI()}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );
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
    <>
      <DeletePopup show={deletePopupShow} onHide={() => {}} />
      <div style={{ marginTop: 25, marginBottom: 64, padding: 8 }}>
        {/* {isChangingAddress ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              height: "150vh",
              background: "rgba(0,0,0,.5)",
            }}
          >
            <Jumbotron
              style={{
                marginTop: 40,
                width: "100vw",
                height: "90vh",
                background: "#1f2223",
                boxShadow: "1px 1px 1px 1px black",
              }}
            >
              <MapWithSearch confirm={mapChangeHandler}></MapWithSearch>
            </Jumbotron>
          </div>
        ) : null} */}
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
          {canEdit ? (
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
                  <Button variant="primary" onClick={changeAddress}>
                    <SiGooglemaps
                      style={{ fontSize: "2rem", margin: 12 }}
                    ></SiGooglemaps>
                  </Button>
                </InputGroup.Append>
              </InputGroup>

              <fieldset>
                <Form.Group style={{ marginLeft: 6, marginTop: 6 }} as={Row}>
                  <Form.Label as="legend" column sm={2}>
                    Meals
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Check
                      type="radio"
                      label="Lunch"
                      name="formHorizontalRadios"
                      id="lunch"
                      defaultChecked
                      onChange={mealHandler}
                    />
                    <Form.Check
                      type="radio"
                      label="Dinner"
                      name="formHorizontalRadios"
                      id="dinner"
                      onChange={mealHandler}
                    />
                    <Form.Check
                      type="radio"
                      label="Both"
                      name="formHorizontalRadios"
                      id="both"
                      onChange={mealHandler}
                    />
                  </Col>
                </Form.Group>
              </fieldset>

              <Form.Group
                style={{ marginTop: 24 }}
                controlId="formBasicQuantity"
              >
                <Form.Label style={{ marginLeft: 6 }}>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  value={quantity}
                  onChange={(val) => setquantity(val.target.value)}
                  placeholder="Quantity"
                  isInvalid={quantityValid}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter how many plates required
                </Form.Control.Feedback>
              </Form.Group>

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
                  style={{ marginTop: 24, marginRight: 24, right: 0 }}
                  variant="danger"
                  onClick={() => setdeletePopupShow(!deletePopupShow)}
                >
                  Delete
                </Button>
                <Button
                  style={{ marginTop: 24 }}
                  variant="primary"
                  onClick={submitRequest}
                >
                  Submit
                </Button>
              </div>
            </Form>
          ) : (
            <div>
              <div>Can Edit the order only between</div>
              <div>
                {process.env.REACT_APP_REG_START_TIME}:00 PM to{" "}
                {process.env.REACT_APP_REG_END_TIME}:00 PM
              </div>

              <Button
                style={{ marginTop: 24 }}
                onClick={() => history.push("/mymeal")}
              >
                My Meal
              </Button>
            </div>
          )}
        </Container>
      </div>
    </>
  );
};

export default EditMeal;
