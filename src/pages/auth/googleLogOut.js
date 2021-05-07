import React, { useEffect } from "react";
import firebase from "../../services/firebaseConfig";
import { useHistory } from "react-router-dom";
import { setIsLogedIn } from "../../utilities/storage";

const GoogleLogOut = () => {
  const history = useHistory();

  useEffect(() => {
    logOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  const logOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setIsLogedIn(false);
        history.push({ pathname: "/" });
      })
      .catch((error) => {
        console.log(error.message);
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
      }}
    >
      <h4>Redirecting to Google Login</h4>
      <button onClick={logOut}>Logout</button>
    </div>
  );
};

export default GoogleLogOut;
