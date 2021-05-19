import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import firebase from "./services/firebaseConfig";
import Home from "./pages/home";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import {
  isDistributor,
  isLogedIn,
  isAdmin,
  setIsDistributor,
  setIsLogedIn,
  setIsAdmin,
} from "./utilities/storage";
import GoogleLogOut from "./pages/auth/googleLogOut";
import MyMeal from "./pages/myMeal";
import BookMeal from "./pages/bookMeal";
import EditMeal from "./pages/bookMeal/editMeal";
import MealRequests from "./pages/MealRequests";
import MealDetails from "./pages/MealRequests/datalis";
import MyMealDetails from "./pages/myMeal/details";
import DataCreater from "./pages/MealRequests/DataCreater";
import Distribution from "./pages/Distribution.js";
import AccountPage from "./pages/auth";
import DivideMeal from "./pages/DivideMeal";

function App() {
  firebase.analytics();
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log(user.displayName);
        setIsLogedIn(true);
        setRefresh(refresh + 1);
        const db = firebase.firestore();
        db.collection("administrators")
          .doc(user.uid)
          .get()
          .then((result) => {
            if (result.data()) {
              if (result.data().isDistributor === true) {
                setIsDistributor(true);
              } else setIsDistributor(false);
              if (result.data().isAdmin === true) {
                setIsAdmin(true);
              } else setIsAdmin(false);
              setIsLogedIn(true);
              setRefresh(refresh + 1);
            }
          })
          .catch((error) => {
            console.log("error ", error.message);
          });
      } else {
        setIsLogedIn(false);
        setIsDistributor(false);
        setIsAdmin(false);
        setRefresh(refresh + 1);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router>
      <Navbar
        isAdmin={isAdmin()}
        isDistributor={isDistributor()}
        isLogedIn={isLogedIn()}
      ></Navbar>
      <Switch>
        <Route path="/" component={Home} exact></Route>
        <Route path="/createdata" component={DataCreater} exact></Route>
        <Route path="/mymeal" component={MyMeal} exact></Route>
        <Route path="/mymeal/:id" component={MyMealDetails} exact></Route>
        <Route path="/bookmeal" component={BookMeal} exact></Route>
        <Route path="/bookmeal/edit/:id" component={EditMeal} exact></Route>
        <Route path="/mealrequest" component={MealRequests} exact></Route>
        <Route path="/mealrequest/:id" component={MealDetails} exact></Route>
        <Route path="/distribution" component={Distribution} exact></Route>
        <Route path="/dividemeal" component={DivideMeal} exact></Route>
        <Route path="/signout" component={GoogleLogOut} exact></Route>
        <Route path="/account" component={AccountPage} exact></Route>
      </Switch>
    </Router>
  );
}

export default App;
