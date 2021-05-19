import React, { useEffect, useState, useRef } from "react";
/* global google */
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
import "./index.js";

const EditMeal = ({ match }) => {
  const id = match.params.id;
  const history = useHistory();

  const [canEdit, setcanEdit] = useState(false);
  const [loading, setloading] = useState(false);

  const [userChanged, setuserChanged] = useState(false);
  const [name, setname] = useState("");
  const [isChangingAddress, setisChangingAddress] = useState(false);
  const [address, setaddress] = useState("");
  const [addressDetail, setaddressDetail] = useState("");
  const [geoPoint, setgeoPoint] = useState({ lat: 1, lng: 1 });
  const [phone, setphone] = useState("");

  const [lunch, setlunch] = useState(true);
  const [dinner, setdinner] = useState(false);
  const [quantityLunch, setQuantityLunch] = useState("");
  const [quantityDinner, setQuantityDinner] = useState("");
  const [lunchOld, setlunchOld] = useState(true);
  const [dinnerOld, setdinnerOld] = useState(false);
  const [quantityLunchOld, setQuantityLunchOld] = useState("");
  const [quantityDinnerOld, setQuantityDinnerOld] = useState("");
  const [remark, setremark] = useState("");

  const [addressValid, setaddressValid] = useState(false);
  const [nameValid, setnameValid] = useState(false);
  const [phoneValid, setphoneValid] = useState(false);
  const [quantityLunchValid, setquantityLunchValid] = useState(false);
  const [quantityDinnerValid, setquantityDinnerValid] = useState(false);

  const [deletePopupShow, setdeletePopupShow] = useState(false);

  //   const addressRef = useRef(null);
  //   let autoComplete = null;

  useEffect(() => {
    // mapGeocoder();
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

  //   const initAutocomplete = () => {
  //     const options = {
  //       strictbounds: true,
  //       type: ["address"],
  //       componentRestrictions: { country: "in" },
  //       fields: ["geometry", "address_components"],
  //     };
  //     autoComplete = new google.maps.places.Autocomplete(
  //       addressRef.current,
  //       options
  //     );
  //     autoComplete.setBounds({
  //       north: 28.5,
  //       south: 28.381183,
  //       west: 76.99,
  //       east: 77.1,
  //     });

  //     autoComplete.addListener("place_changed", onPlaceChanged);
  //   };
  //   const mapGeocoder = () => {
  //     let geocoder = new google.maps.Geocoder();
  //     geocoder.geocode(
  //       { address: "1101 SECTOR-31 GURGAON HARYANA" },
  //       (result, status) => {
  //         console.log(status);

  //         console.log(result);
  //         console.log(result[0].geometry.location.lat());
  //         console.log(result[0].geometry.location.lng());
  //       }
  //     );
  //   };

  //   const onPlaceChanged = () => {
  //     console.log(autoComplete.getPlace());
  //   };

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
        setdinnerOld(data.dinner);
        setlunch(data.lunch);
        setlunchOld(data.lunch);
        setQuantityLunch(data.quantityLunch);
        setQuantityDinner(data.quantityDinner);
        setQuantityLunchOld(data.quantityLunch);
        setQuantityDinnerOld(data.quantityDinner);
        setremark(data.remark);
        setcanEdit(true);
        // initAutocomplete();
      })
      .catch((error) => {
        console.log("error ", error.message);
      });
  };

  const setMealAPI = () => {
    const db = firebase.firestore();
    const batch = db.batch();
    setloading(true);

    const addMeal = db.collection("mealRequests").doc(id);
    batch.update(addMeal, {
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
    });

    var change = {};
    if (lunch && !lunchOld)
      change = {
        ...change,
        totalLunch: firebase.firestore.FieldValue.increment(quantityLunch),
      };
    if (!lunch && lunchOld)
      change = {
        ...change,
        totalLunch: firebase.firestore.FieldValue.increment(-quantityLunchOld),
      };

    if (lunch && lunchOld)
      change = {
        ...change,
        totalLunch: firebase.firestore.FieldValue.increment(
          quantityLunch - quantityLunchOld
        ),
      };

    if (dinner && !dinnerOld)
      change = {
        ...change,
        totalDinner: firebase.firestore.FieldValue.increment(quantityDinner),
      };
    if (!dinner && dinnerOld)
      change = {
        ...change,
        totalDinner: firebase.firestore.FieldValue.increment(
          -quantityDinnerOld
        ),
      };

    if (dinner && dinnerOld)
      change = {
        ...change,
        totalDinner: firebase.firestore.FieldValue.increment(
          quantityDinner - quantityDinnerOld
        ),
      };

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
        setloading(false);
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
      .then((result) => {})
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

    console.log(geoPoint);
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

  const deleteMealAPI = () => {
    const db = firebase.firestore();
    const batch = db.batch();

    const deleteMeal = db.collection("mealRequests").doc(id);
    batch.delete(deleteMeal);

    let change = {
      totalFamily: firebase.firestore.FieldValue.increment(-1),
    };
    if (lunchOld)
      change = {
        ...change,
        totalLunch: firebase.firestore.FieldValue.increment(-quantityLunchOld),
      };
    if (dinnerOld)
      change = {
        ...change,
        totalDinner: firebase.firestore.FieldValue.increment(
          -quantityDinnerOld
        ),
      };

    let date = new Date().toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const decrease_count = db.collection("meal_details").doc(date);
    batch.update(decrease_count, change);

    batch
      .commit()
      .then(() => {
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
        onHide={onHide}
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
                <Form.Label style={{ marginLeft: 6 }}>Name*</Form.Label>
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
                <Form.Label style={{ marginLeft: 6 }}>Phone Number*</Form.Label>
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
              {/* 
              <Form.Group style={{ marginTop: 24 }} controlId="formBasicName">
                <Form.Label style={{ marginLeft: 6 }}>Deliver To*</Form.Label>
                <Form.Control
                  ref={addressRef}
                  type="text"
                  value={addressDetail}
                  onChange={(val) => {
                    setaddressDetail(val.target.value);
                    setuserChanged(true);
                  }}
                  placeholder="Address Details"
                />
              </Form.Group> */}

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
