import React, { Component } from "react";

import GoogleMapReact from "google-map-react";

import styled from "styled-components";

import AutoComplete from "./Autocomplete";
import MarkerIcon from "./Marker";
import { Button } from "react-bootstrap";
import { BiCurrentLocation } from "react-icons/bi";

const Wrapper = styled.main`
  width: 100%;
  height: 100%;
`;

class MapWithSearch extends Component {
  state = {
    mapApiLoaded: false,
    mapInstance: null,
    mapApi: null,
    geoCoder: null,
    places: [],
    center: [],
    zoom: 16,
    address: "",
    draggable: true,
    lat: null,
    lng: null,
  };

  constructor(props) {
    super(props);
    this.refMap = React.createRef();
  }

  componentWillMount() {
    this.setCurrentLocation();
  }

  onDragHandler = () => {
    this.setState({
      lat: this.refMap.current.map_.center.lat(),
      lng: this.refMap.current.map_.center.lng(),
    });
  };

  onDragEndHandler = () => {
    this._generateAddress();
  };

  _onChange = ({ center, zoom }) => {
    this.setState({
      center: center,
      zoom: zoom,
    });
  };

  _onClick = (value) => {
    this.setState({
      lat: value.lat,
      lng: value.lng,
    });
  };

  apiHasLoaded = (map, maps) => {
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps,
    });

    this._generateAddress();
  };

  addPlace = (place) => {
    this.setState({
      places: [place],
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
    });
    this._generateAddress();
  };

  _generateAddress() {
    const { mapApi } = this.state;

    const geocoder = new mapApi.Geocoder();

    geocoder.geocode(
      { location: { lat: this.state.lat, lng: this.state.lng } },
      (results, status) => {
        console.log("qwerty ", results, " pad");
        if (status === "OK") {
          if (results[0]) {
            this.zoom = 12;
            this.setState({
              address: results[0].formatted_address,
            });
          } else {
            window.alert("No results found");
          }
        } else {
          window.alert("Geocoder failed due to: " + status);
        }
      }
    );
  }

  // Get Current Location Coordinates
  setCurrentLocation() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position.coords);
        this.setState({
          center: [position.coords.latitude, position.coords.longitude],
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }

  render() {
    const {
      // places,
      mapApiLoaded,
      mapInstance,
      mapApi,
    } = this.state;

    return (
      <Wrapper>
        {mapApiLoaded && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <AutoComplete
              map={mapInstance}
              mapApi={mapApi}
              addplace={this.addPlace}
            />
            <BiCurrentLocation
              onClick={() => this.setCurrentLocation()}
              style={{
                color: "green",
                fontSize: 45,
                paddingRight: 10,
              }}
            ></BiCurrentLocation>
          </div>
        )}
        <div style={{ height: "50vh" }}>
          <GoogleMapReact
            ref={this.refMap}
            center={this.state.center}
            zoom={this.state.zoom}
            draggable={this.state.draggable}
            onDrag={this.onDragHandler}
            onDragEnd={this.onDragEndHandler}
            onChange={this._onChange}
            // onClick={this._onClick}
            bootstrapURLKeys={{
              key: "AIzaSyDtpv2lBK1Gx0MYNqwuo4V6_BO3oNXwPJA",
              libraries: ["places", "geometry"],
            }}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
            options={{
              restriction: {
                latLngBounds: {
                  north: 28.5,
                  south: 28.381183,
                  west: 76.99,
                  east: 77.1,
                },
                strictBounds: false,
              },
              //   mapId: "b4847045d4f3260e",
              gestureHandling: "greedy",
              mapTypeControl: true,
              // mapTypeControlOptions: {
              //   style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
              //   mapTypeIds: ["roadmap", "terrain"],
              // },
            }}
          >
            <MarkerIcon
              text={this.state.address}
              lat={this.state.lat}
              lng={this.state.lng}
            />
          </GoogleMapReact>
        </div>
        <div
          style={{
            padding: 20,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              textAlign: "center",
              color: "white",
              marginBottom: 20,
            }}
          >
            Address: <span>{this.state.address}</span>
          </div>
          <Button
            onClick={() =>
              this.props.confirm(
                this.state.address,
                this.state.lat,
                this.state.lng
              )
            }
          >
            Set Address
          </Button>
        </div>
      </Wrapper>
    );
  }
}

export default MapWithSearch;
