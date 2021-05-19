import React, { useEffect, useState } from "react";
import { Button, Card, Spinner, Tabs, Tab } from "react-bootstrap";
import { useHistory } from "react-router";
import firebase from "../../services/firebaseConfig";
import { CSVLink } from "react-csv";
import styled from "styled-components";
import { getWhichMealTab, setWhichMealTab } from "../../utilities/storage";
import "./index.css";
import AllDataRequest from "../../components/MealRequests/AllDataRequest";
import LunchDataRequest from "../../components/MealRequests/LunchDataRequest";
import DinnerDataRequest from "../../components/MealRequests/DinnerDataRequest";
import BothDataRequest from "../../components/MealRequests/BothDataRequest";
import MealDetailsScreen from "../../components/MealRequests/MealDetailsScreen";

const MealRequests = () => {
  const history = useHistory();
  var height = window.innerHeight;
  const [mealTab, setmealTab] = useState(getWhichMealTab());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        height: height - 60,
        overflow: "hidden",
      }}
    >
      <Tabs
        className="nav"
        id="controlled-tab-example"
        activeKey={mealTab}
        onSelect={(k) => {
          setmealTab(k);
          setWhichMealTab(k);
        }}
      >
        <Tab eventKey="lunch" title="Lunch">
          <LunchDataRequest />
        </Tab>
        <Tab eventKey="dinner" title="Dinner">
          <DinnerDataRequest />
        </Tab>
        <Tab eventKey="both" title="Both">
          <BothDataRequest />
        </Tab>
        <Tab eventKey="all" title="All">
          <AllDataRequest />
        </Tab>
        <Tab eventKey="details" title="Details">
          <MealDetailsScreen />
        </Tab>
      </Tabs>
    </div>
  );
};

export default MealRequests;

const ButtonStyled = styled(Button)`
  margin: 8px;
`;
