import React, { useEffect, useState } from "react";
import firebase from "../../services/firebaseConfig";
import { useLocation, useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { setIsLogedIn } from "../../utilities/storage";
import { Button, Spinner } from "react-bootstrap";
import img1 from "../../assets/images/btn_google_signin_dark_normal_web.png";

const GoogleLogin = () => {
  const location = useLocation();
  const history = useHistory();
  const [loading, setloading] = useState(true);
  var message = "Redirecting to Google Login";

  const provider = new firebase.auth.GoogleAuthProvider();
  useEffect(() => {
    firebase
      .auth()
      .getRedirectResult()
      .then((result) => {
        if (result.user) {
          console.log(result);
          setIsLogedIn(true);
          if (
            location.state &&
            location.state.prePath &&
            location.state.prePath !== "signin"
          )
            history.push({ pathname: location.state.prePath });
          else history.push({ pathname: "/" });
        } else {
          setloading(false);
        }
      })
      .catch((error) => {
        setloading(false);
        console.log(error.message);
        message = error.message;
      });
  });

  const logIn = () => {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        firebase.auth().signInWithRedirect(provider);
      });
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
      }}
    >
      <Button
        onClick={logIn}
        disabled={loading}
        variant="dark"
        style={{ padding: 0 }}
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
        <img src={img1} alt={"Sign In with Google"} />
      </Button>
    </div>
  );
};

export default GoogleLogin;
