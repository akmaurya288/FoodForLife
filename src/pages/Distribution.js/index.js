import React, { useEffect, useRef, useLayoutEffect, useState } from "react";
import { Button, Card, Container, Jumbotron } from "react-bootstrap";
/* global google */
import firebase from "../../services/firebaseConfig";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import ttm from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";
import {
  getRouteData,
  isRouteCreated,
  setDriverMealList,
  getDriverMealList,
  setIsRouteCreated,
  setRouteData,
  setMealDeliveryData,
  getMealDeliveryData,
  setDeliveryMealType,
  getDeliveryMealType,
  setDirectionWaypoints,
  getDirectionWaypoints,
  setRouteGeoJson,
  getRouteGeoJson,
} from "../../utilities/storage";
import { SiGooglemaps } from "react-icons/si";
import { HiPhone } from "react-icons/hi";
import styled from "styled-components";

const Distribution = () => {
  const [mealData, setMealData] = useState([]);
  const [mealBestData, setMealBestData] = useState([]);
  const [distributionApiData, setdistributionApiData] = useState([]);
  const [isRouteAvailable, setisRouteAvailable] = useState(isRouteCreated());
  const [routeSelectionState, setrouteSelectionState] = useState("start");
  const [bestRouteData, setbestRouteData] = useState(getRouteData());
  const [totalDistance, settotalDistance] = useState("");
  const [totalStops, settotalStops] = useState(0);
  const mapRef = useRef(null);
  const [map, setmap] = useState(null);

  useEffect(() => {
    console.log(getMealDeliveryData());
    console.log(getDriverMealList());
    console.log(bestRouteData);
    if (isRouteAvailable) {
      ShowMealList();
      ShowMap();
    }
    return () => {
      if (map) map.remove();
    };
  }, []);

  const DistributionDataApi = () => {
    const db = firebase.firestore();
    db.collection("routes")
      .doc("route")
      .get()
      .then((result) => {
        if (result.data()) {
          console.log(result.data());
          setdistributionApiData(result.data());
          setrouteSelectionState("driver");
        }
      })
      .catch((error) => {
        console.log("error ", error.message);
      });
  };

  const MealDataApi = (driver) => {
    setDriverMealList(distributionApiData[driver]);
    setDeliveryMealType(distributionApiData.meal_type);

    var promise = [];
    distributionApiData[driver].forEach((element) => {
      promise.push(
        new Promise((resolve, reject) => {
          firebase
            .firestore()
            .collection("mealRequests")
            .doc(element)
            .get()
            .then((result) => {
              if (result.data()) {
                var data = {
                  ...result.data(),
                  id: result.id,
                };
                resolve(data);
              }
            });
        })
      );
    });
    Promise.all(promise).then(
      (result) => {
        setMealData(result);
        setMealDeliveryData(result);
        setrouteSelectionState("best");
      },
      () => {}
    );
  };

  const MealDataRefreshApi = () => {
    var promise = [];
    getDriverMealList().forEach((element) => {
      promise.push(
        new Promise((resolve, reject) => {
          firebase
            .firestore()
            .collection("mealRequests")
            .doc(element)
            .get()
            .then((result) => {
              if (result.data()) {
                var data = {
                  ...result.data(),
                  id: result.id,
                };
                resolve(data);
              }
            });
        })
      );
    });
    Promise.all(promise).then(
      (result) => {
        setMealDeliveryData(result);
        ShowMealList();
      },
      () => {}
    );
    setrouteSelectionState("best");
  };

  const BestRoute = () => {
    let startPosition = { lat: 28.440917, lng: 77.062629 };

    const waypts = [startPosition];
    mealData.forEach((data) => {
      waypts.push({ lat: data.geopoint.lat, lng: data.geopoint.lng });
    });
    setDirectionWaypoints(waypts);
    console.log("calculating route");
    tts.services
      .calculateRoute({
        key: "cRmcJDUJUaNjzcMcRolAnanCiISFFPye",
        traffic: false,
        locations: waypts,
        routeType: "shortest",
        computeBestOrder: true,
        routeRepresentation: "polyline",
      })
      .then((response) => {
        console.log(response);
        setRouteGeoJson(response.toGeoJson());
        setbestRouteData(response);
        setisRouteAvailable(true);
        setIsRouteCreated(true);
        setRouteData(response);
        ShowMap();
        ShowMealList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const markerDiv = (index) => {
    var container = document.createElement("div");
    container.className = "waypoint-marker";

    var number = document.createElement("div");
    number.innerText = index;
    container.appendChild(number);
    return container;
  };

  const ShowMap = () => {
    if (!mapRef.current) return;
    let map = ttm.map({
      key: "cRmcJDUJUaNjzcMcRolAnanCiISFFPye",
      container: mapRef.current,
      center: [77.062629, 28.440917],
      zoom: 14,
    });
    setmap(map);
    map.addControl(new ttm.NavigationControl());
    map.on("load", () => {
      map.addLayer({
        id: "route",
        type: "line",
        source: {
          type: "geojson",
          data: getRouteGeoJson(),
        },
        paint: {
          "line-color": "#2faaff",
          "line-width": 2,
        },
      });
    });

    var response = getRouteData();
    if (response) {
      console.log(response);
      var optimisedLocation = getOptimizedLocation(response.optimizedWaypoints);
      var bounds = new ttm.LngLatBounds();
      var markers = [];
      optimisedLocation.forEach((val, index) => {
        var marker = new ttm.Marker(markerDiv(index)).setLngLat(val).addTo(map);
        markers.push(marker);
        bounds.extend(ttm.LngLat.convert(val));
      });

      map.fitBounds(bounds, { duration: 500, padding: 25 });
    }
  };

  const getOptimizedLocation = (optimizedWaypoints) => {
    let locations = getDirectionWaypoints();
    var optimizedLocations = [locations[0]];
    optimizedWaypoints.forEach(function (waypoint) {
      optimizedLocations.push(locations[waypoint.optimizedIndex + 1]);
    });
    optimizedLocations.push(locations[locations.length - 1]);
    return optimizedLocations;
  };

  const ShowMealList = () => {
    if (getMealDeliveryData() && getRouteData()) {
      var deliveryPoint = [];
      let distance = getRouteData().routes[0].summary.lengthInMeters;
      settotalDistance(`${distance / 1000} km`);
      settotalStops(getRouteData().routes[0].legs.length - 1);

      getRouteData().optimizedWaypoints.forEach((waypoint) => {
        deliveryPoint.push(getMealDeliveryData()[waypoint.optimizedIndex]);
      });
      setMealBestData(deliveryPoint);
    }
  };

  const DriverBtnList = () => {
    return Array.from(
      { length: distributionApiData.total_driver },
      (item, index) => (
        <Button
          style={{ margin: 12 }}
          onClick={() => {
            MealDataApi(`driver_${index + 1}`);
          }}
          variant="success"
          key={index}
        >
          {`driver ${index + 1}`}
        </Button>
      )
    );
  };

  const MealCard = ({ item }) => {
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
        style={{
          margin: 6,
          marginBottom: 16,
          borderRadius: 4,
          boxShadow: "1px 1px 1px 1px black",
          background: "#1f2223",
          color: "white",
          cursor: "pointer",
        }}
      >
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

  const setDelivered = (id) => {
    var data = {};
    if (getDeliveryMealType() === "lunch") data = { delivered_lunch: true };
    if (getDeliveryMealType() === "dinner") data = { delivered_dinner: true };
    const db = firebase.firestore();
    db.collection("mealRequests")
      .doc(id)
      .set(data, { merge: true })
      .then((result) => {
        MealDataRefreshApi();
      })
      .catch((error) => {
        console.log("error ", error.message);
      });
  };

  const setOnWay = (id, geopoint) => {
    var data = {};
    var mapLink = "/" + geopoint.lat + "," + geopoint.lng;
    if (getDeliveryMealType() === "lunch") data = { onway_lunch: true };
    if (getDeliveryMealType() === "dinner") data = { onway_dinner: true };
    const db = firebase.firestore();
    db.collection("mealRequests")
      .doc(id)
      .set(data, { merge: true })
      .then((result) => {
        window.open(
          `https://www.google.com/maps/dir/Current+Location${mapLink}`
        );
      })
      .catch((error) => {
        window.open(
          `https://www.google.com/maps/dir/Current+Location${mapLink}`
        );
        console.log("error ", error.message);
      });
  };

  const MealRouteCard = ({ item }) => {
    if (getDeliveryMealType() === "lunch" && item.delivered_lunch) return null;
    if (getDeliveryMealType() === "dinner" && item.delivered_dinner)
      return null;

    var meal = "";
    if (getDeliveryMealType() === "lunch")
      meal = "Lunch  - " + item.quantityLunch;
    if (getDeliveryMealType() === "dinner")
      meal = "Dinner  - " + item.quantityDinner;

    return (
      <Card
        style={{
          borderRadius: 4,
          boxShadow: "1px 1px 1px 1px black",
          background: "#1f2223",
          color: "white",
        }}
      >
        <Card.Body>
          <Card.Title>{item.name}</Card.Title>

          {item.address ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <div style={{ width: "88%" }}>
                <div
                  style={{
                    color: "#a0a0a0",
                    fontSize: "0.9rem",
                  }}
                >
                  Address
                </div>
                <div
                  style={{
                    color: "#fff",
                    marginBottom: 4,
                    fontSize: "1rem",
                  }}
                >
                  {item.address}
                </div>
              </div>
              <div
                onClick={() => {
                  window.open("https://maps.google.com?q=" + item.address);
                }}
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: 30,
                  background: "#2b4723",
                  color: "#afe84f",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1rem",
                }}
              >
                <SiGooglemaps />
              </div>
            </div>
          ) : null}

          {item.address_detail ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <div style={{ width: "88%" }}>
                <div
                  style={{
                    color: "#a0a0a0",
                    fontSize: "0.9rem",
                  }}
                >
                  Address Detail
                </div>
                <div
                  style={{
                    color: "#fff",
                    marginBottom: 4,
                    fontSize: "1rem",
                  }}
                >
                  {item.address_detail}
                </div>
              </div>
            </div>
          ) : null}

          {item.phone ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <div style={{ width: "88%" }}>
                <div
                  style={{
                    color: "#a0a0a0",
                    fontSize: "0.9rem",
                  }}
                >
                  Phone
                </div>
                <div
                  style={{
                    color: "#fff",
                    marginBottom: 4,
                    fontSize: "1rem",
                  }}
                >
                  {item.phone}
                </div>
              </div>
              <a
                href={`tel:${item.phone}`}
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: 30,
                  background: "#2b4723",
                  color: "#afe84f",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1rem",
                }}
              >
                <HiPhone />
              </a>
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <div style={{ width: "88%" }}>
              <div
                style={{
                  color: "#a0a0a0",
                  fontSize: "0.9rem",
                }}
              >
                Meal Required
              </div>
              <div
                style={{
                  color: "#fff",
                  marginBottom: 4,
                  fontSize: "1rem",
                }}
              >
                {meal}
              </div>
            </div>
          </div>

          {item.remark ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 6,
              }}
            >
              <div style={{ width: "88%" }}>
                <div
                  style={{
                    color: "#a0a0a0",
                    fontSize: "0.9rem",
                  }}
                >
                  Remark
                </div>
                <div
                  style={{
                    color: "#fff",
                    marginBottom: 4,
                    fontSize: "1rem",
                  }}
                >
                  {item.remark}
                </div>
              </div>
            </div>
          ) : null}
        </Card.Body>
        {getDeliveryMealType() === "lunch" ? (
          <ButtonGroubCont>
            {!item.delivered_lunch ? (
              <ButtonStyled
                onClick={() => setDelivered(item.id)}
                variant="success"
              >
                Delivered
              </ButtonStyled>
            ) : null}
            {!item.onway_lunch && !item.delivered_lunch ? (
              <ButtonStyled
                onClick={() => setOnWay(item.id, item.geopoint)}
                variant="success"
              >
                Start Route
              </ButtonStyled>
            ) : null}
          </ButtonGroubCont>
        ) : null}
        {getDeliveryMealType() === "dinner" ? (
          <ButtonGroubCont>
            {!item.delivered_dinner ? (
              <ButtonStyled
                onClick={() => setDelivered(item.id)}
                variant="success"
              >
                Delivered
              </ButtonStyled>
            ) : null}
            {!item.onway_dinner && !item.delivered_dinner ? (
              <ButtonStyled
                onClick={() => setOnWay(item.id, item.geopoint)}
                variant="success"
              >
                Start Route
              </ButtonStyled>
            ) : null}
          </ButtonGroubCont>
        ) : null}
      </Card>
    );
  };

  return (
    <div style={{ marginTop: 2 }}>
      {!isRouteAvailable ? (
        <div>
          {routeSelectionState === "start" ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "87vh",
              }}
            >
              <Button onClick={DistributionDataApi} variant="success">
                Start Route
              </Button>
            </div>
          ) : null}
          {routeSelectionState === "driver" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "87vh",
              }}
            >
              <DriverBtnList></DriverBtnList>
            </div>
          ) : null}
          {routeSelectionState === "best" ? (
            <div>
              <Container
                style={{
                  display: "flex",
                  height: 300,
                  background: "#253423",
                  marginBottom: 12,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button onClick={BestRoute} variant="success">
                  Find Best Route
                </Button>
              </Container>
              {mealData
                ? mealData.map((item, index) => (
                    <MealCard key={index} item={item} index={index} />
                  ))
                : null}
            </div>
          ) : null}
        </div>
      ) : (
        <div>
          <Container
            style={{
              display: "flex",
              height: 300,
              background: "#253423",
              padding: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              ref={mapRef}
              style={{
                width: "100%",
                height: "100%",
              }}
            ></div>
          </Container>
          <div
            style={{
              display: "flex",
              flexDirection: "rows",
              margin: 12,
              color: "#a0a0a0",
            }}
          >
            <Button
              onClick={() => {
                setIsRouteCreated(false);
                setisRouteAvailable(false);
                setrouteSelectionState("start");
                setDriverMealList([]);
                setRouteData([]);
                setMealDeliveryData([]);
              }}
            >
              Reset
            </Button>
            <div style={{ marginLeft: 16 }}>
              <div>Total Distance</div>
              <div>{totalDistance}</div>
            </div>
            <div style={{ marginLeft: 16 }}>
              <div>Total Stops</div>
              <div>{totalStops}</div>
            </div>
          </div>
          {mealBestData
            ? mealBestData.map((item, index) => (
                <MealRouteCard key={index} item={item} index={index} />
              ))
            : null}
        </div>
      )}
    </div>
  );
};

export default Distribution;

const ButtonGroubCont = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 16px;
  margin-bottom: 24px;
`;

const ButtonStyled = styled(Button)`
  margin: 8px;
`;
