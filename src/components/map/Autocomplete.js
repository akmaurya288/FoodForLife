// Autocomplete.js
import googleMapReact from "google-map-react";
import React, { Component } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  padding-right: 10px;
  text-align: center;
`;

class AutoComplete extends Component {
  constructor(props) {
    super(props);
    this.clearSearchBox = this.clearSearchBox.bind(this);
  }

  componentDidMount({ map, mapApi } = this.props) {
    const options = {
      strictbounds: true,
      type: ["address"],
      componentRestrictions: { country: "in" },
      fields: ["geometry", "address_components"],
    };
    this.autoComplete = new mapApi.places.Autocomplete(
      this.searchInput,
      options
    );
    this.autoComplete.addListener("place_changed", this.onPlaceChanged);
    this.autoComplete.setBounds({
      north: 28.5,
      south: 28.381183,
      west: 76.99,
      east: 77.1,
    });
  }

  componentWillUnmount({ mapApi } = this.props) {
    mapApi.event.clearInstanceListeners(this.searchInput);
  }

  onPlaceChanged = ({ map, addplace } = this.props) => {
    const place = this.autoComplete.getPlace();

    // console.log(place);

    if (!place.geometry) return;
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    addplace(place);
    this.searchInput.blur();
  };

  clearSearchBox() {
    this.searchInput.value = "";
  }

  render() {
    return (
      <Wrapper>
        <input
          style={{ width: "100%" }}
          className="search-input"
          ref={(ref) => {
            this.searchInput = ref;
          }}
          type="text"
          onFocus={this.clearSearchBox}
          placeholder="Enter a location"
        />
      </Wrapper>
    );
  }
}

export default AutoComplete;
