import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "leaflet/dist/leaflet.css";
import { sectors } from "./sectorsList";
import { InsidePolygon } from "../../utilities/InsidePolygon";
import firebase from "../../services/firebaseConfig";
import margerSVG from "../../assets/images/marker.svg";
import L from "leaflet";

const DivideMeal = () => {
  const [mealData, setmealData] = useState([]);
  const [point, setpoint] = useState([28.45788852981866, 77.06267957199653]);
  const refMarker = useRef(null);
  const mapRef = useRef(null);
  const [map, setmap] = useState(null);

  var polys = [];
  var markers = [];

  useEffect(() => {
    // CallMealApi();
    return () => {
      if (map) map.remove();
    };
  }, []);

  useEffect(() => {
    AddPolygons();
    AddMarker();
    // errorFinder();
  }, [map, mealData]);

  useLayoutEffect(() => {
    if (mapRef.current) {
      if (!map) {
        let mapL = L.map(mapRef.current).setView([28.440917, 77.062629], 13);
        L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
        }).addTo(mapL);
        setmap(mapL);
        mapL.fitBounds(
          new L.LatLngBounds(
            new L.LatLng(28.392848484246095, 77.0034296713394),
            new L.LatLng(28.541272051492516, 77.11280592704419)
          )
        );
        return () => {
          if (mapL) mapL.remove();
        };
      }
    }
  }, [mapRef]);

  const CallMealApi = () => {
    firebase
      .firestore()
      .collection("mealRequests")
      .get()
      .then((result) => {
        let temp = [];
        result.forEach((data) => {
          temp.push(data.data());
        });
        console.log(temp);
        setmealData(temp);
        GetArea(temp);
      });
  };

  const GetArea = (temp) => {
    temp.forEach((val) => {
      let position = [val.geopoint.lat, val.geopoint.lng];
      let sector = "";
      sectors.forEach((element) => {
        if (InsidePolygon(element.points, position) === 0) {
          sector = element.sector;
        }
      });
      //   console.log(position, sector);
    });
  };

  const markerDropHandler = useMemo(
    () => ({
      dragend() {
        if (refMarker.current) {
          setpoint(refMarker.current.getLatLng());
          console.log(refMarker.current.getLatLng());
          let position = [
            refMarker.current.getLatLng().lat,
            refMarker.current.getLatLng().lng,
          ];
          let sector = "";
          sectors.forEach((element) => {
            if (InsidePolygon(element.points, position) === 0) {
              sector = element.sector;
            }
          });
          console.log(sector);
        }
      },
    }),
    []
  );

  const polygonClickHandler = (item) => {
    console.log(item.sector);
  };

  const AddPolygons = () => {
    if (map) {
      sectors.forEach((sector) => {
        let poly = new L.Polygon([sector.points]);
        poly.on("click", () => {
          polygonClickHandler(sector);
        });
        poly.addTo(map);
      });
    }
  };

  const AddMarker = () => {
    if (map) {
      console.log(mealData);
      mealData.forEach((val) => {
        let position = [val.geopoint.lat, val.geopoint.lng];
        let marker = new L.Marker(position);
        marker.setIcon(iconPerson);

        marker.addTo(map);
      });
    }
  };

  const errorFinder = () => {
    if (map) {
      markers.forEach((val) => {
        val.remove();
      });
      let p1 = [28.349212391922357, 76.95635566400847];
      for (let i = 0; i < 300; i++) {
        for (let j = 0; j < 300; j++) {
          let exist = false;
          let x = i / 2000;
          let y = j / 2000;
          let position = [p1[0] + x, p1[1] + y];
          sectors.forEach((val) => {
            if (InsidePolygon(val.points, position) === 0) {
              exist = true;
            }
          });
          let po = { lat: position[0], lng: position[1] };
          if (exist) {
            let marker = new L.Marker(po);
            marker.setIcon(iconPerson);
            marker.addTo(map);

            markers.push(marker);
          }
        }
      }
    }
  };

  return <div style={{ height: "100vh", width: "100wh" }} ref={mapRef}></div>;
};

export default DivideMeal;

const iconPerson = new L.Icon({
  iconUrl: margerSVG,
  iconRetinaUrl: margerSVG,
  iconSize: new L.Point(10, 10),
});
