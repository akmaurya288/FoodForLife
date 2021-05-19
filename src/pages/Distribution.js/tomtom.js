import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button, Card, Container, Jumbotron } from "react-bootstrap";
/* global google */
import firebase from "../../services/firebaseConfig";
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
} from "../../utilities/storage";
import { SiGooglemaps } from "react-icons/si";
import { HiPhone } from "react-icons/hi";
import styled from "styled-components";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import ttm from "@tomtom-international/web-sdk-maps";
import tts from "@tomtom-international/web-sdk-services";

const TomTomDistribution = () => {
  const refMap = useRef(null);
  const [map, setmap] = useState(null);

  useEffect(() => {
    return () => {};
  }, []);

  useLayoutEffect(() => {
    if (!refMap.current) return;
    let map = ttm.map({
      key: "cRmcJDUJUaNjzcMcRolAnanCiISFFPye",
      container: refMap.current,
      center: [77.062629, 28.440917],
      zoom: 14,
    });
    map.addControl(new ttm.NavigationControl());
    const locations = [{ lat: 28.440917, lng: 77.062629 }];
    // getMealDeliveryData().forEach((data) => {
    //   locations.push({ lat: data.geopoint.lat, lng: data.geopoint.lng });
    // });

    for (let index = 0; index < 10; index++) {
      let point = {
        lat: Math.random() / 50 + 28.44,
        lng: Math.random() / 50 + 77.06,
      };

      locations.push(point);
    }
    locations.push({ lat: 28.440917, lng: 77.062629 });
    var markers = [];
    var route;

    const markerDiv = (index) => {
      var container = document.createElement("div");
      container.className = "waypoint-marker";

      var number = document.createElement("div");
      number.innerText = index;
      number.style = { color: "red" };
      container.appendChild(number);
      return container;
    };

    tts.services
      .calculateRoute({
        key: "cRmcJDUJUaNjzcMcRolAnanCiISFFPye",
        traffic: false,
        locations: locations,
        routeType: "shortest",
        computeBestOrder: true,
        routeRepresentation: "polyline",
      })
      .then((response) => {
        console.log(response.toGeoJson());
        console.log(response);
        console.log(response.toRouteSectionsCollection());
        console.log(response.routes);
        console.log(response.optimizedWaypoints);
        var ol = getOptimizedLocation(response.optimizedWaypoints);
        console.log(ol);
        ol.forEach((val, index) => {
          var marker = new ttm.Marker(markerDiv(index))
            .setLngLat(val)
            .addTo(map);
          markers.push(marker);
        });

        route = map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: response.toGeoJson(),
          },
          paint: {
            "line-color": "#2faaff",
            "line-width": 2,
          },
        });
      })
      .catch(function (error) {
        console.log(error);
      });

    const getOptimizedLocation = (optimizedWaypoints) => {
      var optimizedLocations = [locations[0]];
      optimizedWaypoints.forEach(function (waypoint) {
        optimizedLocations.push(locations[waypoint.optimizedIndex + 1]);
      });
      optimizedLocations.push(locations[locations.length - 1]);
      return optimizedLocations;
    };

    setmap(map);
    return () => {
      map.remove();
    };
  }, [refMap]);

  return (
    <div style={{ marginTop: 2 }}>
      <div
        ref={refMap}
        style={{
          width: "100%",
          height: 500,
        }}
      ></div>
    </div>
  );
};

export default TomTomDistribution;

const ButtonGroubCont = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 16px;
  margin-bottom: 24px;
`;

const ButtonStyled = styled(Button)`
  margin: 8px;
`;
