import React, { Component } from "react";

import GoogleMapReact from "google-map-react";

import styled from "styled-components";

import MarkerIcon from "./Marker";
import { Button } from "react-bootstrap";

const Wrapper = styled.main`
  width: 100%;
  height: 100%;
`;

class MapNoSearch extends Component {
  state = {
    mapApiLoaded: false,
    mapInstance: null,
    mapApi: null,
    geoCoder: null,
    center: [],
    zoom: 15,
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

  _generateAddress() {
    const { mapApi } = this.state;

    const geocoder = new mapApi.Geocoder();

    geocoder.geocode(
      { location: { lat: this.state.lat, lng: this.state.lng } },
      (results, status) => {
        console.log("qwerty ", results, " pad");
        console.log(status);
        if (status === "OK") {
          if (results[0]) {
            this.zoom = 12;
            this.setState({ address: results[0].formatted_address });
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
        this.setState({
          center: [position.coords.latitude, position.coords.longitude],
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }

  render() {
    return (
      <Wrapper>
        <div style={{ height: "60vh" }}>
          <GoogleMapReact
            ref={this.refMap}
            center={this.state.center}
            zoom={this.state.zoom}
            draggable={this.state.draggable}
            onDrag={this.onDragHandler}
            onDragEnd={this.onDragEndHandler}
            onChange={this._onChange}
            onClick={this._onClick}
            bootstrapURLKeys={{
              key: "AIzaSyDtpv2lBK1Gx0MYNqwuo4V6_BO3oNXwPJA",
              libraries: ["geometry"],
            }}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
            options={{ gestureHandling: "greedy" }}
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
            Change Address
          </Button>
        </div>
      </Wrapper>
    );
  }
}

export default MapNoSearch;
